# :jigsaw: serverless

## :dart: Features

A microservice that sends verification mail to users who create a new account using the REST API for [http://prod.sydrawat.me:1337](http://prod.sydrawat.me:1337).

Amazon SES does not trigger multiple verification e-mails to the user even if the user hits the endpoint `/v1/account/` multiple times. The verification mail is sent only once per unique user email-id.

The user has a 5 minute window to verify their account by clicking on the verification link sent in the email. Once verified, the user can continue using the REST API, otherwise the user should not be able to consume the REST API.

## :rocket: Running the microservice using Amazon SES

To push your lambda function to work with Amazon SES and SNS, we need to first `.zip` the Lambda function. We then update the function we created during our Cloudformation stack creation. Here's a list of commands on how to perform the fore-mentioned steps:

```shell
# create a .zip of the Lambda function (make sure you're in the correct working directory)
zip -r lambda-fn.zip ./

# pushing lambda function microservice to SES trigger
aws lambda update-function-code --function-name <your-lambda-fn-name> --zip-file fileb://lambda-fn.zip
```

## WIP

> TODO: Implement/Configure GitHub actions to run the above command on `push` to `master` branch.

## :ninja: Author

[Siddharth Rawat](mailto:rawat.sid@northeastern.edu)

## :scroll: License

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
