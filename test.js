const Learner = require('./models/learner')
const openAI = require('./ds/open-ai/generate')


const argv = process.argv
const param = argv[2]
const param2 = argv[3]

// getSynthLearner(param)
async function getSynthLearner(first_name){
    let synth = await openAI.getSyntheticLearnerObject(first_name)
    console.log(synth)//////////
}

// getAllLearners()
async function getAllLearners() {
    let all = await Learner.getAll()
    console.log(all)////////
}

// searchLearner({first_name: param, email: param2})
async function searchLearner(obj) {
    let learners = await Learner.search(obj)
    console.log(learners)/////
}

// deleteLearner(param)
async function deleteLearner(uuid){
    let res = await Learner.delete(uuid)
    console.log(res)///////
}

let obj =             {
    "first_name": "Peter",
    "middle_name": "Michael",
    "last_name": "Rabbit",
    "suffix": "",
    "prefix": "",
    "preferred_name": "Peter",
    "preferred_first_name": "Peter",
    "preferred_middle_name": "Michael",
    "preferred_last_name": "Rabbit",
    "preferred_name_type": "PreferredName",
    "preferred_pronoun": "He",
    "student_identifier": "",
    "student_identification_system": "",
    "personal_information_verification": "",
    "personal_information_type": "",
    "address_type": "",
    "street_number_and_name": "2 Some Street",
    "apartment_room_or_suite_number": "",
    "city": "Adelaide",
    "state_abbreviation": "SA",
    "postal_code": "5000",
    "country_name": "Australia",
    "country_code": "AU",
    "latitude": "-34.921896",
    "longitude": "138.599080",
    "country_ansi_code": 10000,
    "address_do_not_publish_indicator": "Yes",
    "phone_number": {
        "mobile": {
            "phone_number_type": "Work",
            "primary_phone_number_indicator": "Yes",
            "phone_number": "0400000000",
            "phone_do_not_publish_indicator": "Yes",
            "phone_number_listed_status": "Listed"
        },
        "telephone": {
            "phone_number_type": "Home",
            "primary_phone_number_indicator": "No",
            "phone_number": "",
            "phone_do_not_publish_indicator": "Yes",
            "phone_number_listed_status": "Listed"
        }
    },
    "email_address_type": "Work",
    "email_address": "peter.doe@gmail.com",
    "email_do_not_publish_indicator": "Yes",
    "backup_email_address": "peter.doe2@gmail.com",
    "birth_date": "2000-09-21",
    "gender": "NotSelected",
    "country_of_birth_code": "AU",
    "ethnicity": "",
    "organisation_email_id": "peter.doe@foobar.com",
    "employer_id": "test_employer_id",
    "affiliation": "",
    "employer": "Foobar",
    "employer_email": "testid@employer.com",
    "uuid": "tiMXkIWQzaib5ivCFUtR"
}
updateLearner(obj)
async function updateLearner(obj){
    let learner = new Learner(obj)
    let res = await learner.update()
    console.log(res)///////
    if(res.error){
        console.log(res.error.data)
        console.log(typeof res.error.data)
        for(let i=0; i<res.error.data.data.length; i++) {
            console.log(res.error.data.data[i])
            console.log("....")
        }
    }
    
}