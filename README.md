# booking-service

> Generate PDFs from HTML with S3 + Serverless.

![Unit tests status](https://github.com/tomfa/booking-service-api/actions/workflows/tests.yml/badge.svg)
![ESLint status](https://github.com/tomfa/booking-service-api/actions/workflows/lint.yml/badge.svg)

Mono repo containing 3 packages:

- [@booking-service/api](https://github.com/tomfa/booking-service-api/tree/master/api): Serverless API
- [@booking-service/web](https://github.com/tomfa/booking-service-api/tree/master/web): NextJS application
- [@booking-service/shared](https://github.com/tomfa/booking-service-api/tree/master/shared): Shared utils and types

### Setup

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
