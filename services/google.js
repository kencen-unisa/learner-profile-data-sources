const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const axios = require("axios")

const auth_url = "https://crucial-gasket-398302-api.c3l.ai/authentication/api/v1/sign-in/credentials"
const api_url = "https://crucial-gasket-398302-api.c3l.ai"
const learner_microservice = "/learner-profile-service/api/v1"
let token = ""

function getToken(){
    return new Promise((resolve, reject)=>{
        axios.post(auth_url, {
            "email": process.env.GOOGLE_CLP_CRED_EMAIL,
            "password": process.env.GOOGLE_CLP_CRED_PASSWORD
        })
        .then(function(res) {
            resolve (res.data.data.idToken)
        })
        .catch(function(err){
            console.log("Error getting token")//////
            console.log(err)////////
            console.log("--------------------------")//////
            resolve({error: err})
        })
    })
}

function saveLearner(obj) {
    let url = `${api_url}/learner-profile-service/api/v1/learner`

    return new Promise(async(resolve, reject) =>{
        let token = await getToken()
        axios({
            method: 'post',
            url: url,
            headers: {'Authorization': `Bearer ${token}`},
            data: obj
        })
        .then(function(res){
            if(res.data.success===true){
                resolve(res.data)
            }
            else{
                resolve({error: res.data})
            }
        })
        .catch(function(err){
            resolve({error: err})
        })
})
}

function getAllLearners() {
    let url = `${api_url}/learner-profile-service/api/v1/learners`
    
    return new Promise(async(resolve, reject)=>{
        let token = await getToken()
        axios({
            method: 'get',
            url: url,
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then(function(res){
            if(res.data.success===true){
                resolve (res.data.data.records)
            }
            else{
                resolve({error: res.data.message})
            }
        })
        .catch(function(err){
            resolve({error: err})
        })
    })
}

async function getLearnerByUuid(uuid) {
    let url = `${api_url}${learner_microservice}/learner/${uuid}`
    return new Promise(async(resolve, reject)=>{
        let token = await getToken()
        axios({
            method: 'get',
            url: url,
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then(function(res){
            if(res.data.success===true){
                resolve (res.data.data)
            }
            else{
                resolve({error: res.data.message})
            }
        })
        .catch(function(err){
            resolve({error: err})
        })
    })
}

/**
 * 
 * @param {*} obj {first_name:"", email:""}
 * @returns 
 */
async function searchLearner(obj){
    let first_name = obj.first_name
    let email = obj.email
    if(!first_name && !email) {
        return {error: "First Name or Email required to search"}
    }
    let param = ""
    if(first_name){
        param += `first_name=${first_name}`
    }
    if(first_name && email){
        param += `&`
    }
    if(email){
        param += `email_address=${email}`
    }
    let url = `${api_url}/learner-profile-service/api/v1/learner/search?${param}`
    console.log(url)//////
    
    return new Promise(async (resolve, reject) =>{
        let token = await getToken()
        axios({
            method: 'get',
            url: url,
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then(function(res){
            // console.log(res.data)///////
            if(!res.data.success){
                resolve({error: res.data})
            }
            else{
                resolve(res.data.data)
            }
        })
        .catch(function(err){
            resolve({error: err})
        })
    })
}

function deleteLearner(uuid){
    const url = `${api_url}/learner-profile-service/api/v1/learner/${uuid}`
    console.log(url)/////////
    return new Promise(async(resolve, reject)=>{
        let token = await getToken()
        axios({
            method: 'delete',
            url: url,
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then(function(res){
            resolve(res.data)
        })
        .catch(function(err){
            resolve({error: err})
        })
    })
}

function updateLearner(obj){
    console.log(obj)////////
    let uuid = obj.uuid
    const url = `${api_url}${learner_microservice}/learner/${uuid}`
    console.log(url)/////////
    delete obj.uuid
    delete obj.middle_name  //somehow, you can't have this in body = can't update this
    delete obj.prefix   //somehow, you can't have this in body = can't update this
    delete obj.suffix   //somehow, you can't have this in body = can't update this

    return new Promise(async(resolve, reject)=>{
        let token = await getToken()
        axios({
            method: 'put',
            url: url,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: obj
        })
        .then(function(res){
            resolve(res.data)
        })
        .catch(function(err){
            resolve({error: err.response})
        })
    })
}

module.exports = {
    getAllLearners,
    searchLearner,
    getLearnerByUuid,
    saveLearner,
    deleteLearner,
    updateLearner,
}