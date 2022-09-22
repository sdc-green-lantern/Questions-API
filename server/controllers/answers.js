const { client } = require('../db.js');

module.exports = {
  getAllAnswers: async function (req, res) {
    try {
      const query = `select a.*, json_agg(COALESCE(p.url,'')) as photos from answers a left join photos p ON p.answer_id = a.id where question_id=${req.params.question_id} GROUP BY a.id`;
      const result = await client.query(query);
      res.status(201).send(result.rows)
    }
    catch (err) {
      console.log('ERROR : ', err);
    }
  },
  postAnswer: async function (req, res) {
    try {
      const query = `with insertAnswers as (
        insert into answers (question_id, body, answerer_name, answerer_email)
        values ($1, $2, $3, $4)
        returning id
      )
      insert into photos (answer_id, url)
      select id, $5 from insertAnswers`
      const insertToAnswers = await client.query(query, [req.params.question_id, req.body.body, req.body.name, req.body.email, req.body.photos]);
      res.status(201).end();
    }
    catch (err) {
      console.log('error : ', err)
    }
  },
  helpfulAnswer: async function (req, res) {
    console.log('query : ', req.params)
    try {
      const result = await client.query(`update answers set answer_helpful=answer_helpful + 1 where id=${req.params.answer_id}`)
      res.status(201).end();
    }
    catch (err) {
      console.log('err : ', err);
    }
  },
  reportAnswer: async function (req, res) {
    try {
      const result = await client.query(`update answers set reported=true where id=${req.params.answer_id}`)
      res.status(201).end();
    }
    catch (err) {
      console.log('err : ', err);
    }
  }
}