# :jigsaw: Serverless

[![Serverless Microservice](https://github.com/ArtemisIX/serverless/actions/workflows/deploy-lambda.yml/badge.svg)](https://github.com/ArtemisIX/serverless/actions/workflows/deploy-lambda.yml)

This is a simple microservice that will trigger an email via Amazon SES to the user, asking them to verify their account, in order to consume the REST API.

## :dart: Features

A microservice that sends verification mail to users who create a new account using the REST API for [http://prod.sydrawat.me:1337](http://prod.sydrawat.me:1337).

Amazon SES does not trigger multiple verification e-mails to the user even if the user hits the endpoint `/v1/account/` multiple times. The verification mail is sent only once per unique user email-id.

The user has a 5 minute window to verify their account by clicking on the verification link sent in the email. Once verified, the user can continue using the REST API, otherwise the user should not be able to consume the REST API.

## :rocket: Running the microservice using Amazon SES

To push your lambda function to work with Amazon SES and SNS, we need to first `.zip` the Lambda function. We then update the function we created during our Cloudformation stack creation. Here's a list of commands on how to perform the fore-mentioned steps:

```shell
# create a .zip of the Lambda function (make sure you're in the correct working directory)
zip -r <your-lambda-fn>.zip ./

# pushing lambda function microservice to SES trigger
aws lambda update-function-code --function-name <your-lambda-fn-name> --zip-file fileb://lambda-fn.zip
```

## :arrows_clockwise: Github Actions workflow for CI/CD pipelines

We will push out our serverless function to Amazon Lambda via a GitHub workflow, where each time we push to the serverless email microservice, we will update the lambda function on the Amazon Lambda service.

## :ninja: Author

[Siddharth Rawat](mailto:rawat.sid@northeastern.edu)

## :scroll: License

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
