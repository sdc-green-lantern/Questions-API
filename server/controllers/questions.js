const { client } = require('../db.js');

module.exports = {
  getAllQuestions: async function (req, res) {
    try {
      const query = `select json_agg(
        json_build_object(
          'question_id', q.id,
          'question_body', q.body,
          'question_date', q.created,
          'asker_name', q.asker_name,
          'asker_email', q.asker_email,
          'question_helpfulness', q.question_helpful,
          'reported', q.reported,
          'answers', (
            select coalesce(json_object_agg (
              a.id, (
                select json_build_object(
                  'id', a.id,
                  'body', a.body,
                  'date', a.created,
                  'answerer_name', a.answerer_name,
                  'answerer_email', a.answerer_email,
                  'helpfulness', a.answer_helpful,
                  'photos', (
                    select coalesce(json_agg(row_to_json(p)), '[]')
                    from (select id, url from photos p where p.answer_id = a.id) p)
                  )
              )
            ),'[]') from answers a where a.question_id = q.id
          )
        )
      ) as results from questions q where q.reported = false and q.product_id = ${req.query.product_id}`

      const result = await client.query(query);
      res.status(201).send(result.rows);
    }
    catch (err) {
      console.log('error : ', err);
    }
  },
  postQuestion: async function (req, res) {
    try {
      const result = await client.query(
        `insert into questions (product_id, body, asker_name, asker_email) values ($1, $2, $3, $4)`,
        [req.query.product_id, req.body.body, req.body.asker_name, req.body.asker_email])
      res.status(201).end()
    }
    catch (err) {
      console.log('err : ', err);
    }

  },
  helpfulQuestion: async function (req, res) {
    console.log('req : ', req.params)
    try {
      const result = await client.query(`update questions set question_helpful=question_helpful + 1 where id=${req.params.question_id}`)
      res.status(201).end();
    }
    catch (err) {
      console.log('err : ', err);
    }
  },
  reportQuestion: async function (req, res) {
    try {
      const result = await client.query(`update questions set reported=true where id=${req.params.question_id}`)
      res.status(201).end()
    }
    catch (err) {
      console.log('err : ', err)
    }
  }
}