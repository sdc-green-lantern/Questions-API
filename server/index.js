require("dotenv").config();
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3000;
const db = require('./db.js');
const morgan = require('morgan');

const { getAllQuestions, postQuestion, helpfulQuestion, reportQuestion } = require('./controllers/questions.js');
const { getAllAnswers, postAnswer, helpfulAnswer, reportAnswer } = require('./controllers/answers.js')

const app = express();

app.use(express.static(path.join(__dirname, "./db.js")));
app.use(express.json());
app.use(morgan('dev'));

app.get('/qa/questions', getAllQuestions);
app.get('/qa/questions/:question_id/answers', getAllAnswers);

app.post('/qa/questions', postQuestion)
app.post('/qa/questions/:question_id/answers', postAnswer);

app.patch('/qa/questions/:question_id/helpful', helpfulQuestion);
app.patch('/qa/answers/:answer_id/helpful', helpfulAnswer);

app.patch('/qa/questions/:question_id/report', reportQuestion);
app.patch('/qa/answers/:answer_id/report', reportAnswer);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})

module.exports = { PORT }

