const router = require('express').Router();
const OpenAI = require('openai');
const openai = new OpenAI();

router.get('/', async (req, res) => {
    try {
        const suggestionsData = await openai.chat.completions.create({
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant designed to output JSON.",
              },
              { role: "user", content: "Who won the world series in 2020?" },
            ],
            model: "gpt-3.5-turbo-0125",
            response_format: { type: "json_object" },
          });
          
          console.log(suggestionsData.choices[0].message.content);
          res.status(200).json(suggestionsData);
    } catch(err) {
        res.status(400).json(err);
        console.log(err);
    }
});

module.exports = router;