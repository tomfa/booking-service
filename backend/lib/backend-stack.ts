import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';

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
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
    });

    const vpc = new ec2.Vpc(this, 'vailable-vpc');
    const cluster = new rds.ServerlessCluster(this, 'vailable-rds-cluster', {
      engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(
        this,
        'ParamterGroup',
        'default.aurora.postgresql10'
      ),
      defaultDatabaseName: 'vailable_db',
      vpc,
      scaling: { autoPause: cdk.Duration.seconds(0) },
    });

    // Create the Lambda function that will map GraphQL operations into Postgres
    const postFn = new lambda.Function(this, 'vailable-api-lambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: new lambda.AssetCode('lambda'),
      handler: 'index.handler',
      memorySize: 1024,
      environment: {
        CLUSTER_ARN: cluster.clusterArn,
        SECRET_ARN: cluster.secret?.secretArn || '',
        DB_NAME: 'vailable_db',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      },
    });
    // Grant access to the cluster from the Lambda function
    cluster.grantDataApiAccess(postFn);
    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', postFn);

    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'getResourceById' });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'getBookingById' });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'getCustomerByIssuer' });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'findResources' });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'findBookings' });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'findAvailability' });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'getNextAvailable' });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'getLatestBooking' });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'getBookedDuration' });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'getCustomerByEmail' });
    lambdaDs.createResolver({ typeName: 'Query', fieldName: 'getCustomerById' });

    lambdaDs.createResolver({ typeName: 'Mutation', fieldName: 'addResource' })
    lambdaDs.createResolver({ typeName: 'Mutation', fieldName: 'updateResource' })
    lambdaDs.createResolver({ typeName: 'Mutation', fieldName: 'updateCustomer' })
    lambdaDs.createResolver({ typeName: 'Mutation', fieldName: 'addBooking' })
    lambdaDs.createResolver({ typeName: 'Mutation', fieldName: 'deleteResource' })
    lambdaDs.createResolver({ typeName: 'Mutation', fieldName: 'cancelBooking' })
    lambdaDs.createResolver({ typeName: 'Mutation', fieldName: 'addCustomer' })
    lambdaDs.createResolver({ typeName: 'Mutation', fieldName: 'disableCustomer' })

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
