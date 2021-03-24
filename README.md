# pdf-generator

Mono repo containing 3 packages:

- [@pdf-generator/api](https://github.com/tomfa/pdf-generator-api/tree/master/api): Serverless API
- [@pdf-generator/web](https://github.com/tomfa/pdf-generator-api/tree/master/web): NextJS application
- [@pdf-generator/shared](https://github.com/tomfa/pdf-generator-api/tree/master/shared): Shared utils and types

### Setup

```
yarn
```

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
