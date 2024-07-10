const router = require('express').Router();
const OpenAI = require('openai');
const openai = new OpenAI();
const { User, Goals, Notes, DailyChecks, DailyChecksHistory, Events, Tasks } = require('../../models');

const goalTypes = ["Travel", "Reading", "Fitness", "Work", "Love Life", "Family", "Friendships", "Money", "Clubs", "Career", "Saving", "Classes", "Hobbies", "Health"]
let existingGoals = [];
let existingNotes = [];
let existingChecks = [];
let existingTasks = [];

router.get('/goals', async (req, res) => {
  try {
    const goalsData = await Goals.findAll({ where: { user_id: req.session.user_id } });
    const goals = goalsData.map(goal => goal.get({ plain: true }));

    for (let i = 0; i < goals.length; i++) {
      existingGoals.push(goals[i].goal);
    }

    try {
      let suggestion = goalTypes[Math.floor(Math.random() * goalTypes.length)];

      const suggestionsData = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to output JSON.",
          },
          { role: "user", content: "Can you give me a new yearly goal that breaks down into a monthly goal that breaks down into a weekly goal? Type of goal: " + suggestion + ". Only suggest one set of goals. Please do not suggest any of these goals: " + existingGoals + ". Please format three short phrases in an array called 'goalSuggestions', in order of: yearly, monthly, weekly. Please only have the goal content in each array element, without 'yearly', 'monthly', or 'weekly' in the element." },
        ],
        model: "gpt-3.5-turbo-0125",
      });

      // console.log(suggestionsData.choices[0].message.content);
      res.status(200).json(suggestionsData.choices[0].message.content);
    } catch (err) {
      res.status(400).json(err);
      console.log(err);
    }

  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }


});

router.get('/notes', async (req, res) => {
  try {
    const notesData = await Notes.findAll({ where: { user_id: req.session.user_id } });
    const notes = notesData.map(note => note.get({ plain: true }));
    for (let i = 0; i < notes.length; i++) {
      existingNotes.push(notes[i].note);
    }

    try {
      const suggestionsData = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to output JSON.",
          },
          { role: "user", content: "Can you give me three different notes or reminders that people typically need? Please do not include anything in " + existingNotes + ". Please format short notes or reminders in an array called 'noteSuggestions'. Please only have the note content in each array element." },
        ],
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
      });

      // console.log(suggestionsData.choices[0].message.content);
      res.status(200).json(suggestionsData.choices[0].message.content);
    } catch (err) {
      res.status(400).json(err);
      console.log(err);
    }


  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasksData = await Tasks.findAll({ where: { user_id: req.session.user_id } });
    const tasks = tasksData.map(task => task.get({ plain: true }));

    for (let i = 0; i < tasks.length; i++) {
      existingTasks.push(tasks[i].task);
    }

    const suggestionsData = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        { role: "user", content: "Can you give me three different work tasks that people typically need to do throughout the week? Please do not suggest anything in this list: " + existingTasks + ". Please format short notes or reminders in an array called 'taskSuggestions'. Please only have the task content in each array element." },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });

    // console.log(suggestionsData.choices[0].message.content);
    res.status(200).json(suggestionsData.choices[0].message.content);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

router.get('/checks', async (req, res) => {
  try {
    const checksData = await DailyChecks.findAll({ where: { user_id: req.session.user_id } });
    const checks = checksData.map(check => check.get({ plain: true }));
    for (let i = 0; i < checks.length; i++) {
      existingChecks.push(checks[i].daily_check);
    }
    try {
      const suggestionsData = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to output JSON.",
          },
          { role: "user", content: "Can you give me three different daily tasks that people typically need to do throughout the day, for example floss, drink water, stretch or take vitamins? Please do not include any thing in this list: " + existingChecks + ". Please format short notes or reminders in an array called 'checkSuggestions'. Please only have the task content in each array element." },
        ],
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
      });

      // console.log(suggestionsData.choices[0].message.content);
      res.status(200).json(suggestionsData.choices[0].message.content);
    } catch (err) {
      res.status(400).json(err);
      console.log(err);
    }
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

module.exports = router;