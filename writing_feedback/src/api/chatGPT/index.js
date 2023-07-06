const { key } = require('../../key/chatGTP')

const call_chatGTP = async (prompt) => {
    return fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 200,
        stream: false,
        n: 1,
      }),
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
    return err.message
    }
    )
}

export default call_chatGTP