'use strict'
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const nodemailer = require("nodemailer")
const nodemailerObj = {
    host: process.env.SMTP_HOST || 'smtp.office365.com',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE.toLowerCase() === 'true' : false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_FROM,
      pass: process.env.SMTP_PASS
    },
    tls: {
      ciphers: process.env.SMTP_TLS_CIPHERS || 'SSLv3'
    }
}

const AUTH_ENDPOINT = `${process.env.GOOGLE_CLP_ENDPOINT}/authentication/api/v1/sign-in/credentials`
const AUTH_EMAIL = process.env.GOOGLE_CLP_CRED_EMAIL
const AUTH_PASSWORD = process.env.GOOGLE_CLP_CRED_PASSWORD
const LRS_ENDPOINT = `${process.env.GOOGLE_CLP_ENDPOINT}/learning-record-service/api/v1`

// learner uuid
const MONITOR_LEARNER = 'gPfm6iT0ioRfmCOZyBAO'
// frequency in seconds
const MONITOR_FREQUENCY = 30000
// type of event to monitor
const MONITOR_TYPE_URL = 'https://w3id.org/xapi/video/verbs/played'

// extracted token from auth
// structure:  {idToken, sessionId}
let token = {}

// get token from auth
// returns:  {idToken, sessionId}
function getToken(){
    return new Promise((resolve, reject)=>{
        fetch(AUTH_ENDPOINT, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": AUTH_EMAIL,
                "password": AUTH_PASSWORD
            })
        })
        .then(res => res.json())
        .then(result => {
            // console.log(result)
            if (result.success) {
                resolve({
                    idToken: result.data.idToken,
                    sessionId: result.data.session_id
                })
            } else {
                throw new Error(JSON.stringify(result))
            }
        })
        .catch(err => reject(err))
    })
}


// get statements from LRS api
/** returns:  {
    records: [
        {Object}, {Object}, ...
    ]
} */
function getStatements(verbName) {
    return new Promise((resolve, reject)=>{
        fetch(`${LRS_ENDPOINT}/statements?verb_name=${verbName}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.idToken}`
            }
        })
        .then(res => res.json())
        .then(result => {
            // console.log(result)
            if (result.success) {
                resolve(result.data)
            } else {
                throw new Error(JSON.stringify(result))
            }
        })
        .catch(err => reject(err))
    })
}


// get verb object to monitor
/** returns:  {
 *   "name",
 *   "url",
 *   "canonical_data",
 *   "uuid",
 *   "created_time",
 *   "last_modified_time"
 * }
 */
function getMonitorVerb() {
    return new Promise((resolve, reject)=>{
        fetch(`${LRS_ENDPOINT}/verbs`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.idToken}`
            }
        })
        .then(res => res.json())
        .then(result => {
            // console.log(result)
            if (result.success) {
                const data = result.data.records
                let res = {}
                for (const verb of data) {
                    if (verb.url === MONITOR_TYPE_URL) {
                        res = verb
                        break
                    }
                }
                resolve(res)
            } else {
                throw new Error(JSON.stringify(result))
            }
        })
        .catch(err => reject(err))
    })
}

async function main() {
    token = await getToken()
    // console.log(token)

    const verb = await getMonitorVerb()
    // console.log(verb)

    const statements = await getStatements(verb.name)
    // console.log(statements)
    
    const now = new Date()
    for (const st of statements.records) {
        console.log(st.timestamp)
        if (new Date(st.timestamp) >= new Date(now - MONITOR_FREQUENCY * 1000)) {
            console.log(`Statement #${st.uuid} detected.`)
            await sendEmail()
        }
    }
}

main()




/**
 * Send out emails using SMTP
 */
function sendEmail(options = {}) {
    return new Promise((resolve, reject) => {
      if (!nodemailerObj.auth.user || !nodemailerObj.auth.pass) {
        return reject(`Invalid SMTP credentials.`)
      }
  
      const transporter = nodemailer.createTransport(nodemailerObj)
      const emailFrom = options.from || process.env.SMTP_FROM
      const emailTo = options.to || process.env.SMTP_TO
      const emailCc = options.cc || process.env.SMTP_CC
      const emailBcc = options.bcc || process.env.SMTP_BCC
      const emailSubject = `${options.subject || process.env.EMAIL_SUBJECT || 'New Video Played Detected'}`
      transporter.sendMail({
        from: emailFrom,
        replyTo: options.replyTo,
        to: emailTo,
        cc: emailCc,
        bcc: emailBcc,
        subject: emailSubject,
        text: options.text || process.env.EMAIL_CONTENT,
        html: options.html,
        attachments: options.attachments,
      }, (err, info) => {
        if (err) {
          reject(err)
        } else {
          resolve(info)
        }
      })
    })
  }