const AWS = require('aws-sdk')
const SES = new AWS.SES()

function validOrigin (testOrigin) {
  const validOrigins = [
    'http://xch.perguth.de:8080',
    'https://www.thingylabs.io'
  ]
  return validOrigins.filter(origin => origin === testOrigin)[0] || validOrigins[0]
}

function sendEmail(formData, callback) {
  const emailParams = {
    Source: 'www-thingylabs-io@thingylabs.io',
    ReplyToAddresses: [formData.email],
    Destination: {
      ToAddresses: ['team@thingylabs.io'],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `${formData.message}\n\nName: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Contact via ' + formData.source,
      },
    },
  }

  SES.sendEmail(emailParams, callback)
}

module.exports.staticSiteMailer = (event, context, callback) => {
  const origin = event.headers.Origin || event.headers.origin
  const formData = JSON.parse(event.body)

  if (formData.blank) return
  if (!validOrigin(origin)) return

  sendEmail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    }

    callback(null, response)
  })
}
