// const { key } = require('../../key/PaLM2.js');

// const { TextServiceClient } =
//   require("@google-ai/generativelanguage").v1beta2;

// const { GoogleAuth } = require("google-auth-library");

// const MODEL_NAME = "models/text-bison-001";
// const API_KEY  = key;

// const client = new TextServiceClient({
//   authClient: new GoogleAuth().fromAPIKey(API_KEY),
// });

// const prompt = "Repeat after me: one, two,";

// module.exports={client, MODEL_NAME}

const { key } = require('../../key/PaLM2.js');

const url = `https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage?key=${key}`

const call_PaLM2 = async (prompt) => {
  console.log("check")
  console.log(prompt)
  const body = {
    prompt: {messages: [{content: prompt}]}
  }
    return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(body),
    })
        .then(res => {
            console.log(res)
            return res.json()
        })
        .then(response => {
          console.log(response)
          return response
        }
        )
        .catch(err => {
          console.log(err.message)
        }
        )
}

export default call_PaLM2