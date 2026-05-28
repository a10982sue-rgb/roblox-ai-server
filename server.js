const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

const OPENROUTER_KEY = "PUT_YOUR_KEY_HERE";

app.post("/chat", async (req, res) => {
    try {
        const message = req.body.message;

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-v4-flash",
                    messages: [
                        {
                            role: "system",
                            content: "You are a Roblox NPC assistant."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log(data);

        const reply =
            data.choices?.[0]?.message?.content ||
            "No response.";

        res.json({
            reply: reply
        });

    } catch (err) {
        console.log(err);

        res.json({
            reply: "Error."
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});