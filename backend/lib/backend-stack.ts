/* eslint-disable no-new */

import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'vailable-api', {
      name: 'vailable-backend-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),

      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            // @ts-ignore
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
    });

    const vpc = new ec2.Vpc(this, 'vailable-vpc', {
      cidr: '10.0.0.0/20',
      natGateways: 0,
      maxAzs: 2,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          cidrMask: 22,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 22,
          name: 'private',
          subnetType: ec2.SubnetType.ISOLATED,
        },
      ],
    });
    const privateSg = new ec2.SecurityGroup(this, 'private-sg', {
      vpc,
      securityGroupName: 'private-sg',
    });
    privateSg.addIngressRule(
      privateSg,
      ec2.Port.allTraffic(),
      'allow internal SG access'
    );

    const subnetGroup = new rds.SubnetGroup(this, 'rds-subnet-group', {
      vpc,
      subnetGroupName: 'aurora-subnet-group',
      vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      description: 'An all private subnets group for the DB',
    });

    const cluster = new rds.ServerlessCluster(this, 'vailable-rds-cluster', {
      engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(
        this,
        'ParamterGroup',
        'default.aurora-postgresql10'
      ),
      defaultDatabaseName: 'vailable_db',
      enableDataApi: true,
      vpc,
      subnetGroup,
      securityGroups: [privateSg],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // @ts-ignore
      scaling: { autoPause: cdk.Duration.minutes(5) },
    });

    // Create the Lambda function that will map GraphQL operations into Postgres
    const postFn = new lambda.Function(this, 'vailable-api-lambda', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
      securityGroups: [privateSg],
      runtime: lambda.Runtime.NODEJS_12_X,
      code: new lambda.AssetCode('lambda', { exclude: ['*.ts'] }),
      handler: 'lambda.handler',
      // @ts-ignore
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      environment: {
        CLUSTER_ARN: cluster.clusterArn,
        SECRET_ARN: cluster.secret?.secretArn || '',
        DB_NAME: 'vailable_db',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        UUID_NAMESPACE: '016c09f7-962a-416c-b65f-de4a81d622c6',
        ALLOWED_ORIGINS:
          'http://localhost:8000,http://localhost:5000,https://vailable.eu',
        JWT_ISSUER: 'api.vailable.eu',
        ACCEPTED_ISSUERS: 'auth.kroloftet.no',
      },
    });
    postFn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['secretsmanager:GetSecretValue'],
        resources: [cluster.secret?.secretArn || ''],
      })
    );
    new ec2.InterfaceVpcEndpoint(this, 'secrets-manager', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      vpc,
      privateDnsEnabled: true,
      subnets: { subnetType: ec2.SubnetType.ISOLATED },
      securityGroups: [privateSg],
    });
    // Grant access to the cluster from the Lambda function
    cluster.grantDataApiAccess(postFn);
    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', postFn);

    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getResourceById',
    });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'getBookingById' });
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getCustomerByIssuer',
    });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'findResources' });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'findBookings' });
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'findAvailability',
    });
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getNextAvailable',
    });
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getLatestBooking',
    });
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getBookedDuration',
    });
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getCustomerByEmail',
    });
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getCustomerById',
    });

    lambdaDs.createResolver({ typeName: 'Mutation', fieldName: 'addResource' });
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateResource',
    });
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateCustomer',
    });
    lambdaDs.createResolver({ typeName: 'Mutation', fieldName: 'addBooking' });
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'disableResource',
    });
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'cancelBooking',
    });
    lambdaDs.createResolver({ typeName: 'Mutation', fieldName: 'addCustomer' });
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'disableCustomer',
    });
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'setBookingComment',
    });

    // CFN Outputs
    new cdk.CfnOutput(this, 'AppSyncAPIURL', {
      value: api.graphqlUrl,
    });
    new cdk.CfnOutput(this, 'AppSyncAPIKey', {
      value: api.apiKey || '',
    });
    new cdk.CfnOutput(this, 'ProjectRegion', {
      value: this.region,
    });
  }
}
