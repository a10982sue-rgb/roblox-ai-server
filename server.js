```js
const fetch = (...args) =>
    import('node-fetch').then(({default: fetch}) => fetch(...args))

require("dotenv").config()

const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("AI server running")
})

app.post("/chat", async (req, res) => {

    try {

        console.log("MESSAGE:", req.body.message)

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${process.env.OPENROUTER_KEY}`,

                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    model: "deepseek/deepseek-v4-flash",

                    messages: [
                        {
                            role: "user",
                            content: req.body.message
                        }
                    ]
                })
            }
        )

        const data = await response.json()

        console.log(data)

        res.json({
            reply:
                data.choices?.[0]?.message?.content
                || "No AI response"
        })

    } catch (err) {

        console.log(err)

        res.json({
            reply: "SERVER ERROR"
        })

    }

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})