const { key } = require('../../key/PaLM2.js');

const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${key}`

const call_PaLM2 = async (prompt) => {
    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: {
            "prompt": {
                "text": prompt
                }
        },
    })
        .then(res => {
            return res.json()
        })
        .then(
            console.group(response)
        )
}

export default call_PaLM2
