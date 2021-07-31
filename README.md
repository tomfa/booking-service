# booking-service

> Generate PDFs from HTML with S3 + Serverless.

![Unit tests status](https://github.com/tomfa/booking-service-api/actions/workflows/tests.yml/badge.svg)
![ESLint status](https://github.com/tomfa/booking-service-api/actions/workflows/lint.yml/badge.svg)
[![codecov](https://codecov.io/gh/tomfa/booking-service/branch/master/graph/badge.svg?token=BX9E38JQO8)](https://codecov.io/gh/tomfa/booking-service)

Mono repo containing 3 packages:

- [@booking-service/api](https://github.com/tomfa/booking-service-api/tree/master/api): Serverless API
- [@booking-service/web](https://github.com/tomfa/booking-service-api/tree/master/web): NextJS application
- [@booking-service/shared](https://github.com/tomfa/booking-service-api/tree/master/shared): Shared utils and types
- [@vailable](https://github.com/tomfa/booking-service-api/tree/master/sdk): SDK for integration

### Initial setup

```
yarn
```

#### Infrastructure

The infrastructure is set up initially using terraform.

```
yarn infrastructure:deploy
```

_This assumes you have terraform >= 0.12 installed, and AWS credentials set on your machine._

### Run

```
yarn start
```

_Starts all packages concurrently_

### Test

```
yarn test

# In watch mode
yarn test:watch
```

#### Linting

This repository uses ESLint and Prettier.

[`husky`](https://typicode.github.io/husky/#/) is used to check and fix linting errors on commit. They can also be run with the scripts below.

```
# Runs eslint check
yarn lint

# Runs prettier check
yarn lint:prettier-check
```

## Using this repo as a template

### Rename

1. Search replace `booking-api` -> `new-project-name`
2. Search replace `vailable.eu` -> `new-domain.com`

### Deploy infrastructure

3. Set up Route53 DNS
   ```sh
   cd infrastructure
   terraform init
   terraform apply -target=module.domain
   ```
4. Update your registrar DNS pointers to the generated servers
5. Deploy remaining infrastructure
   ```sh
   terraform apply
   ```

### Set up CI

Things are already setup with github CI, but you'll need to add the following secrets to the repository:

```
# Used by deployment of api.
# You need to create and provide these keys yourself
AWS_MASTER_ACCESS_KEY_ID
AWS_MASTER_SECRET_ACCESS_KEY

# Used by deployment of web.
# The values are outputted from terraform apply in the previous step
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

# Bucket for deployment of web.
# The values are outputted from terraform apply in the previous step
AWS_WEB_BUCKET_NAME
AWS_WEB_CLOUDFRONT_ID

# Dummy user database, e.g. tmp-admin-user:passwordz
USER_DATA

# Random value acting as your JWT_SECRET.
JWT_SECRET

# Random UUID acting as your servers identifier for uuid v5
UUID_NAMESPACE
```
