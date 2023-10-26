'use strict'
const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router();
const json = require('koa-json')
const koaStatic = require('koa-static')
const koaViews = require('@ladjs/koa-views')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const AUTH_ENDPOINT = `${process.env.GOOGLE_CLP_ENDPOINT}/authentication/api/v1/sign-in/credentials`
const AUTH_EMAIL = process.env.GOOGLE_CLP_CRED_EMAIL
const AUTH_PASSWORD = process.env.GOOGLE_CLP_CRED_PASSWORD
const LRS_ENDPOINT = `${process.env.GOOGLE_CLP_ENDPOINT}/learning-record-service/api/v1`

const SERVER_PORT = 8586
// refresh token interval in minutes
const REFRESH_TOKEN_INTERVAL = 30
// how many records return
const LRS_RECORDS = 10
// type if LRS records
const LRS_TYPE = 'Video'
const PAGE_TITLE = 'LRS Video Events History'

// refresh and extract token from auth
// structure:  {idToken, sessionId}
let token = {}
async function refreshToken() {
    token = await getToken()
    console.log(`Token refreshed [${token.sessionId}].`)
}
refreshToken()
setInterval(refreshToken, REFRESH_TOKEN_INTERVAL * 60 * 1000)

// get token from auth
// returns:  {idToken, sessionId}
function getToken() {
    return new Promise((resolve, reject) => {
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


/**
 * KOA webserver section
 */
app.use(koaStatic(path.join(__dirname, '/public')))
app.use(koaViews(path.join(__dirname, '/views'), { extension: 'ejs' }))
app.use(json()).use(router.routes()).use(router.allowedMethods())

router.use(async (ctx, next) => {
    await next()
    const rt = ctx.response.get('X-Response-Time')
    console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// x-response-time
router.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
})

router
    .get('/', async ctx => {
        // wait until token loaded
        while (!token.idToken) {
            console.log('Token not ready, wait for 1s.')
            await wait(1)
        }

        const verbs = await getAllVideoMonitorVerb()

        const selectedVerb = ctx.query['verb']
        let statements = []
        if (selectedVerb && /^[\w\-\s]+$/.test(selectedVerb)) {
            console.log(selectedVerb)
            statements = await getStatementsByVerb(selectedVerb)
        }

        await ctx.render('index', {
            title: PAGE_TITLE,
            verbs,
            selectedVerb,
            statements
        })
    })
    .get('/statements', async ctx => {
        let statements = []
        const verb = ctx.query['verb']
        if (verb && /^[\w\-\s]+$/.test(verb)) {
            console.log(verb)
            statements = await getStatementsByVerb(verb)
        }
        ctx.body = statements
    });

app.listen(SERVER_PORT);

/**
 * End of KOA webserver section
 */

function wait(sec) {
    return new Promise(resovle => {
        setTimeout(resovle, sec * 1000)
    })
}






/**
 * LRS section
 */

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
function getAllVideoMonitorVerb() {
    return new Promise((resolve, reject) => {
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
                    let res = []
                    for (const verb of data) {
                        console.log(`Verb [${verb.name}] found.`)
                        if (verb.name.startsWith(LRS_TYPE)) {
                            console.log('Verb added.')
                            res.push(verb)
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


// get statements from LRS api
/** returns:  {
    records: [
        {Object}, {Object}, ...
    ]
} */
function getStatementsByVerb(verbName) {
    return new Promise((resolve, reject) => {
        fetch(`${LRS_ENDPOINT}/statements?verb_name=${verbName}&limit=${LRS_RECORDS}`, {
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
                    resolve(result.data.records)
                } else {
                    throw new Error(JSON.stringify(result))
                }
            })
            .catch(err => reject(err))
    })
}

/**
 * End of LRS section
 */
