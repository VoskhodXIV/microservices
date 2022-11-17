const aws = require('aws-sdk')

aws.config.update({ region: 'us-east-1' })
const ses = new aws.SES({ region: 'us-east-1' })
const docClient = new aws.DynamoDB.DocumentClient()

const handler = async (event) => {
  const message = event.Records[0].Sns.Message
  const json = JSON.parse(message)
  const email = json.username
  const { token } = json
  const seconds = 5 * 60
  const secondsInEpoch = Math.round(Date.now() / 1000)
  const expirationTime = secondsInEpoch + seconds

  const table = {
    TableName: 'csye-6225',
    Item: {
      Email: email,
      Token: token,
      TimeToLive: expirationTime,
    },
  }

  // Putting an item to DynamoDB Table
  docClient.put(table, (err, data) => {
    if (err) {
      console.error(
        'Unable to add item. Error JSON:',
        JSON.stringify(err, null, 2)
      )
    }
  })

  const mailbody = `
        <h3>Hi, ${email}</h3>
        <p>
          Thank you for signing up with Network Structures and Cloud Computing coursework for this semester!
          While we have you registered to use our REST API service, we need to verify your account.
          </br>
          The below link will redirect you to verify your email and allow your to consume our REST API.
          <b>Link below link will be valid only for 5 minutes:</b>
          </br>
        </p>
        <p> Verify your link:
          <a href=prod.sydrawat.me:1337/v1/verifyUserEmail?token=${token}&email=${email} >
          prod.sydrawat.me:1337/v1/verifyUserEmail?token=${token}&email=${email}</a>
        </p>
        <br/>
        Thank You!
        <br/>`

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
        Data: 'Account verification for CSYE6225: Action required',
      },
    },
    Source: 'non-reply@prod.sydrawat.me',
  }
  console.log('Email successfully sent to:', { email })
  return ses.sendEmail(params).promise()
}

module.exports = {
  handler,
}
