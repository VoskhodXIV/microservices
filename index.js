const AWS = require('aws-sdk')

const checkSentEmail = async (
  dynamoDBClient,
  trackUserEmailDynamoDBTable,
  email
) => {
  const params = {
    TableName: trackUserEmailDynamoDBTable,
    Key: {
      Email: email,
    },
  }
  const data = await dynamoDBClient.get(params).promise()
  if (data.Item) return true
  return false
}

const logSentEmail = async (
  dynamoDBClient,
  trackUserEmailDynamoDBTable,
  email
) => {
  const params = {
    TableName: trackUserEmailDynamoDBTable,
    Item: {
      Email: email,
    },
  }
  const data = await dynamoDBClient.put(params).promise()
  console.log('User data added', data)
}

const handler = async (event, context, callback) => {
  console.log(`Received event ${JSON.stringify(event, null, 4)}`)
  const trackUserEmailDynamoDBTable = process.env.TrackUserEmailDynamoDBTable
  const trackUserEmailDynamoDBRegion =
    process.env.TrackUserEmailDynamoDBRegion || 'us-west-1'
  const domainEnvironment = process.env.DomainEnvironment || 'prod'

  console.log('Setting AWS region to:', trackUserEmailDynamoDBRegion)
  AWS.config.update({ region: emailTrackingDynamoDBRegion })
  const dynamoDBClient = new AWS.DynamoDB.DocumentClient({
    region: trackUserEmailDynamoDBRegion,
  })

  const message = event.Records[0].Sns.Message
  const parsedMessage = JSON.parse(message)
  console.log('Parsed message:', parsedMessage)
  const email = parsedMessage.username
  const { first_name, last_name, token } = parsedMessage

  const emailAlreadySent = checkSentEmail(
    dynamoDBClient,
    trackUserEmailDynamoDBTable,
    email
  )

  if (!emailAlreadySent) {
    console.log(`Sending email to ${email}`)
    const ses = new AWS.SES()
    const mailbody = `
          <h3>Hello ${first_name}} ${last_name},</h3>
          <p>
            Thank you for registering with Network Structures and Cloud Computing coursework for this semester!
          </p>
          <p>
            While we have you registered to use our REST API service, we need to verify your account.
          </p>
          <br>
          <p>
            The below link will redirect you to verify your email and allow your to consume our REST API.
            <b>Link below link will be valid only for 5 minutes:</b>
            <br>
          </p>
          <p> Verify your account:
            <br>
            <a href=https://${domainEnvironment}.sydrawat.me/v2/verifyUserEmail?token=${token}&email=${email} >
            https://${domainEnvironment}.sydrawat.me/v2/verifyUserEmail?token=${token}&email=${email}</a>
          </p>
          <br>
          <p>
            If you did not create a account with us, it is possible that someone else is trying to access our service
            by using your account ${email}. <b>Do not forward or give this link to anyone.</b>
          </p>
          <br>
          <p>
            You received this email because you require access to use our REST API services. If you think this is
            incorrect, please contact our support team.
          </p>
          <br>
          Sincerely,
          <br/>
          The ${domainEnvironment} CSYE team
          <br>`

    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: mailbody,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `Account verification for ${domainEnvironment} CSYE6225 REST API: Action required`,
        },
      },
      Source: `noreply@${domainEnvironment}.sydrawat.me`,
    }
    try {
      const data = await ses.sendEmail(params).promise()
      console.log(data)
      console.log('Email successfully sent to:', { email })
    } catch (err) {
      console.log(`Could not send the email: `, err)
    }
    // Log this email to track sent emails to prevent duplicate verification email-link generation
    try {
      await logSentEmail(dynamoDBClient, trackUserEmailDynamoDBTable, email)
      console.log('Email successfully logged to trackUserEmailDynamoDBTable')
    } catch (err) {
      console.log(
        `Could not store the email to trackUserEmailDynamoDBTable: `,
        err
      )
    }
  } else {
    console.log(`Email already sent to user: ${email}. No need to send again`)
  }
}

module.exports = {
  handler,
}
