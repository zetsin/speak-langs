const https = require('https')

const { google } = require('googleapis')
const service_account = require('./service_account.json')

const client = new google.auth.JWT(
  service_account.client_email,
  null,
  service_account.private_key,
  ['https://www.googleapis.com/auth/calendar'],
  null,
)

module.exports = () => new Promise((resolve, reject) => {
  client.authorize((err, token) => {
    if(err) {
      reject(err)
      return 
    }

    const calendar = google.calendar({
      version: 'v3',
      auth: client
    })

    const d = new Date()
    const date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

    calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      resource: {
        start: {
          date
        },
        end: {
          date
        },
        conferenceData: {
          createRequest: {
            conferenceSolution: {
              key: {
                type: 'hangoutsMeet'
              }
            },
            requestId: `${d.getTime()}-${Math.random()}`
          }
        }
      }
    })
    .then(res => {
      resolve(res.data.hangoutLink)
    })
    .catch(reject)
  })
})
