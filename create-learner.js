const Learner = require('./models/learner')
const openAI = require('./ds/open-ai/generate')


/** *********************************************
 * Use this script with first name as parameter
 ********************************************** */
const argv = process.argv
if(argv.length<3){
    console.log("Please enter a first name as parameter when calling this script. Eg: create-learner.js Jane")//////
    process.exit(1)
}
const first_name = argv[2]
// console.log(first_name)///////

main(first_name)
async function main(first_name) {
    console.log(`Calling OpenAI API to create Learner with first name "${first_name}"`)
    let synth = await openAI.getSyntheticLearnerObject(first_name)
    // console.log(synth)//////////
    if(!synth){
        console.log(`Failed getting synthetic data.`)//////
        console.log(synth)////////
        process.exit(1)
    }

    let learner = new Learner(synth)
    console.log(learner)//////
    let res = await learner.create()
    if(res.error){
        console.log("Error:")/////
        console.log(res.error)/////
    }
    else{
        console.log(res.message)/////
    }
    console.log("####### FINISHED #######")///////
}
