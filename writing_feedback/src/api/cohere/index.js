// const options = {
//     method: 'POST',
//     headers: {
//       accept: 'application/json',
//       'content-type': 'application/json',
//       authorization: 'Bearer Shzw4XWi2LSsAv9ZnaBtIVh3LjTMl4UurUMECWKs'
//     },
//     body: JSON.stringify({
//       max_tokens: 20,
//       return_likelihoods: 'NONE',
//       truncate: 'END',
//       prompt: 'Please explain to me how LLMs work'
//     })
//   };

// const call_cohere = (prompt) => {
//     return fetch('https://api.cohere.ai/v1/generate', {
//         method: 'POST',
//         headers: {
//           accept: 'application/json',
//           'content-type': 'application/json',
//           authorization: 'Bearer Shzw4XWi2LSsAv9ZnaBtIVh3LjTMl4UurUMECWKs'
//         },
//         body: JSON.stringify({
//           max_tokens: 50,
//           return_likelihoods: 'NONE',
//           truncate: 'END',
//           prompt: prompt
//         })
//       })
//     .then(res => {
//     console.log(res)
//     return res.json()
//     })
//     .then(response => {
//     console.log(response)
//     return response.generations[0].text
//     }
//     )
//     .catch(err => {
//     console.log(err.message)
//     return err.message
//     }
//     )
// }

// export default call_cohere

import axios from 'axios';

const options = {
  method: 'POST',
  url: 'https://api.cohere.ai/v1/generate',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: 'Bearer Shzw4XWi2LSsAv9ZnaBtIVh3LjTMl4UurUMECWKs'
  },
  data: {
    max_tokens: 20,
    return_likelihoods: 'NONE',
    truncate: 'END',
    prompt: 'Please explain to me how LLMs work'
  }
};

const call_cohere = async (prompt) => {
    console.log('calling?')
    return axios
    .request({
        method: 'POST',
        url: 'https://api.cohere.ai/v1/generate',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer Shzw4XWi2LSsAv9ZnaBtIVh3LjTMl4UurUMECWKs'
        },
        data: {
          max_tokens: 200,
          return_likelihoods: 'NONE',
          truncate: 'END',
          prompt: prompt
        }
      })
    .then(function (response) {
        console.log(response.data);
        return response.data
    })
    .then (function (res) {
        console.log(res);
        return res.generations[0].text
    })
    .catch(function (error) {
        console.error(error);
        return error.message
    });
}

export default call_cohere