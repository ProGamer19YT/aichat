import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/api/ai", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ bot: "Boş mesaj göndərilə bilməz." });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are MyChatAI assistant." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();

        res.json({ bot: data.choices[0].message.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ bot: "Server xətası baş verdi" });
    }
});

app.listen(3000, () => console.log("Backend çalışır 3000"));
