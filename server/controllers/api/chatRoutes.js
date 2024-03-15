const router = require('express').Router();
const OpenAI = require('openai');
const openai = new OpenAI();

router.get('/goals/:suggestion', async (req, res) => {
    try {
        const suggestionsData = await openai.chat.completions.create({
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant designed to output JSON.",
              },
              { role: "user", content: "Can you give me a new yearly goal that breaks down into a monthly goal that breaks down into a weekly goal? Types of goal: " + req.params.suggestion + ". Only suggest one set of goals. Please format three short phrases in an array called 'goalSuggestions', in order of: yearly, monthly, weekly. Please only have the goal content in each array element, without 'yearly', 'monthly', or 'weekly' in the element." },
            ],
            model: "gpt-3.5-turbo-0125",
            response_format: { type: "json_object" },
          });
          
          console.log(suggestionsData.choices[0].message.content);
          res.status(200).json(suggestionsData.choices[0].message.content);
    } catch(err) {
        res.status(400).json(err);
        console.log(err);
    }
});

router.get('/notes', async (req, res) => {
  try {
      const suggestionsData = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant designed to output JSON.",
            },
            { role: "user", content: "Can you give me three different notes or reminders that people typically need? Please format short notes or reminders in an array called 'noteSuggestions'. Please only have the note content in each array element." },
          ],
          model: "gpt-3.5-turbo-0125",
          response_format: { type: "json_object" },
        });
        
        console.log(suggestionsData.choices[0].message.content);
        res.status(200).json(suggestionsData.choices[0].message.content);
  } catch(err) {
      res.status(400).json(err);
      console.log(err);
  }
});

module.exports = router;