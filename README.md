# pdf-generator-api

> Generate PDFs from HTML with S3 + Serverless.

![Unit tests status](https://github.com/tomfa/pdf-generator-api/actions/workflows/tests.yml/badge.svg)
![ESLint status](https://github.com/tomfa/pdf-generator-api/actions/workflows/lint.yml/badge.svg)

## API

| method | url                       | docs                                                                                                                       |
| ------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/generate/from_html`     | [fromHtml.test.ts](https://github.com/tomfa/pdf-generator-api/blob/master/src/endpoints/generate/fromHtml.test.ts)         |
| `POST` | `/generate/from_html`     | [fromHtml.test.ts](https://github.com/tomfa/pdf-generator-api/blob/master/src/endpoints/generate/fromHtml.test.ts)         |
| `GET`  | `/generate/from_template` | [fromTemplate.test.ts](https://github.com/tomfa/pdf-generator-api/blob/master/src/endpoints/generate/fromTemplate.test.ts) |
| `POST` | `/generate/from_template` | [fromTemplate.test.ts](https://github.com/tomfa/pdf-generator-api/blob/master/src/endpoints/generate/fromTemplate.test.ts) |
| `GET` | `/templates` | [templates.test.ts](https://github.com/tomfa/pdf-generator-api/blob/master/src/endpoints/templates/listTemplates.test.ts) |

## Development

### Setup

```
yarn install

# Replace variables after copy
cp .env.test .env
```

#### Create S3 bucket

You will need to create an AWS S3 bucket for files to be stored in.

Either do this manually, or if you use terraform, you can create it with the following command:

```
cd infrastructure
terraform init
terraform apply
```

### Run locally

```
yarn start
```

### Tests

```
yarn test
# or yarn test:watch
```

### Deploy

```
yarn deploy
```

_`yarn deploy` requires AWS credentials to be available locally._

```
# Only if you have not set up credentials already.
export AWS_ACCESS_KEY_ID=AKIAexample...
export AWS_SECRET_ACCESS_KEY=de0YBexample..
```

Logs from Lambda can be fetched with

```
yarn logs
# or yarn logs:watch
```
