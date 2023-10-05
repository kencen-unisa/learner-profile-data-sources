const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const { OpenAI } = require('openai');
const { copyFileSync } = require('fs');
const { constants } = require('buffer');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const chatCompletionURL = `https://api.openai.com/v1/chat/completions`

async function callChatCompletionAPI(prompt) {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: "You are a expert synthetic data generator."},
            {role: "user", content: prompt}
        ],
    })
    console.log(completion)////////
    // for(let i=0; i<completion.choices.length; i++) {////////
    //     console.log("--- choices ["+i+"] ---")////////
    //     console.log(completion.choices[i])///////
    // }//////////

    let retval = JSON.parse(completion.choices[0].message.content)
    return retval
}//end callChatCompletionAPI()






module.exports = {
    callChatCompletionAPI,
}