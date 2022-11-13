const aws = require('aws-sdk')

aws.config.update({ region: 'us-east-1' })
const ses = new aws.SES({ region: 'us-east-1' })
const docClient = new aws.DynamoDB.DocumentClient()

const emailHandler = async (event) => {
  const message = event.Records[0].Sns.Message
  const json = JSON.parse(message)
  const email = json.username
  const { token } = json
  const seconds = 5 * 60
  const secondsInEpoch = Math.round(Date.now() / 1000)
  const expirationTime = secondsInEpoch + seconds

  // Creating a table for DynamoDB
  const table = {
    TableName: 'csye-6225',
    Item: {
      Email: email,
      TokenName: token,
      TimeToLive: expirationTime,
    },
  }
  console.log('Adding new item')

  // Putting an item to DynamoDB Table
  docClient.put(table, (err, data) => {
    if (err) {
      console.error(
        'Unable to add item. Error JSON:',
        JSON.stringify(err, null, 2)
      )
    } else {
      console.log('Added:', JSON.stringify(data, null, 2))
    }
  })
  console.log(`email:${email} token:${token}`)

  const mailbody = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <p>Hi, ${email}</p>
        <p>
          Please verify your email</br>
          <b>Link will be valid only for 5 minutes!</b>
          </br>
          Find your link below:
        </p>
        <p>
          <a href=https://prod.sydrawat.me/v1/user/verifyUserEmail?token=${token}&email=${email} >
          https://prod.sydrawat.me/v1/user/verifyUserEmail?token=${token}&email=${email}</a>
        </p>
      </body>
    </html>`

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
        Data: 'Email Verification',
      },
    },
    Source: 'noreply@prod.sydrawat.me',
  }
  console.log('email sent')
  return ses.sendEmail(params).promise()
}

module.exports = {
  emailHandler,
}
