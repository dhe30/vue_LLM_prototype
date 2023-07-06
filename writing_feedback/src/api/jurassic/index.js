const { key } = require('../../key/Jurassic2')

// const call_jurassic = async (prompt) => {
//     return fetch("https://api.ai21.com/studio/v1/j2-mid/complete", {
//         headers: {
//             "Authorization": "Bearer " + key,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             "prompt": prompt,
//             "numResults": 1,
//             "maxTokens": 200,
//             "temperature": 0.7,
//             "topKReturn": 0,
//             "topP":1,
//             "countPenalty": {
//                 "scale": 0,
//                 "applyToNumbers": false,
//                 "applyToPunctuations": false,
//                 "applyToStopwords": false,
//                 "applyToWhitespaces": false,
//                 "applyToEmojis": false
//             },
//             "frequencyPenalty": {
//                 "scale": 0,
//                 "applyToNumbers": false,
//                 "applyToPunctuations": false,
//                 "applyToStopwords": false,
//                 "applyToWhitespaces": false,
//                 "applyToEmojis": false
//             },
//             "presencePenalty": {
//                 "scale": 0,
//                 "applyToNumbers": false,
//                 "applyToPunctuations": false,
//                 "applyToStopwords": false,
//                 "applyToWhitespaces": false,
//                 "applyToEmojis": false
//             },
//             "stopSequences":[]
//             }),
//         method: "POST"
//         }
//     )
//     .catch(err => {
//         console.log(err.message)
//     })
// }

const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: 'Bearer vFrs7ICufXgykqVq5KZATv4Hq7rgAE2Y'
    },
    body: JSON.stringify({
      numResults: 1,
      maxTokens: 16,
      minTokens: 0,
      temperature: 0.7,
      topP: 1,
      topKReturn: 0,
      frequencyPenalty: {
        scale: 1,
        applyToWhitespaces: true,
        applyToPunctuations: true,
        applyToNumbers: true,
        applyToStopwords: true,
        applyToEmojis: true
      },
      presencePenalty: {
        scale: 0,
        applyToWhitespaces: true,
        applyToPunctuations: true,
        applyToNumbers: true,
        applyToStopwords: true,
        applyToEmojis: true
      },
      countPenalty: {
        scale: 0,
        applyToWhitespaces: true,
        applyToPunctuations: true,
        applyToNumbers: true,
        applyToStopwords: true,
        applyToEmojis: true
      },
      prompt: 'I like to dance.'
    })
  };
  
  const call_jurassic = async(text) => {
    return fetch('https://api.ai21.com/studio/v1/j2-mid/complete', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: key
    },
    body: JSON.stringify({
      numResults: 1,
      maxTokens: 200,
      minTokens: 0,
      temperature: 0.7,
      topP: 1,
      topKReturn: 0,
      frequencyPenalty: {
        scale: 0,
        applyToWhitespaces: false,
        applyToPunctuations: false,
        applyToNumbers: false,
        applyToStopwords: false,
        applyToEmojis: false
      },
      presencePenalty: {
        scale: 0,
        applyToWhitespaces: false,
        applyToPunctuations: false,
        applyToNumbers: false,
        applyToStopwords: false,
        applyToEmojis: false
      },
      countPenalty: {
        scale: 0,
        applyToWhitespaces: false,
        applyToPunctuations: false,
        applyToNumbers: false,
        applyToStopwords: false,
        applyToEmojis: false
      },
      prompt: text
    })
  })
    .then(res => {
    console.log(res)
    return res.json()
    })
    .then(response => {
    console.log(response)
    return response.completions[0].data.text
    }
    )
    .catch(err => {
    console.log(err.message)
    return err.message
    }
    )
}


export default call_jurassic