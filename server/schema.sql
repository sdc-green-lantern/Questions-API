DROP TABLE stg_questions;
DROP TABLE stg_answers;

DROP TABLE photos;
DROP TABLE answers;
DROP TABLE questions;

CREATE TABLE questions (
 id BIGSERIAL NOT NULL,
 product_id INTEGER NOT NULL,
 body TEXT NOT NULL,
 created DATE NOT NULL DEFAULT CURRENT_DATE,
 asker_name TEXT NOT NULL,
 asker_email TEXT NOT NULL,
 reported BOOLEAN NOT NULL DEFAULT 'false',
 question_helpful INT NOT NULL DEFAULT 0
);

CREATE TABLE stg_questions (
 id BIGSERIAL NOT NULL,
 product_id INTEGER NOT NULL,
 body TEXT NOT NULL,
 created BIGINT NOT NULL,
 asker_name TEXT NOT NULL,
 asker_email TEXT NOT NULL,
 reported BOOLEAN NOT NULL DEFAULT 'false',
 question_helpful INT NOT NULL DEFAULT 0
);

ALTER TABLE questions ADD CONSTRAINT questions_pkey PRIMARY KEY (id);

CREATE TABLE answers (
 id BIGSERIAL NOT NULL,
 question_id INTEGER NOT NULL,
 body TEXT NOT NULL,
 created DATE NOT NULL DEFAULT CURRENT_DATE,
 answerer_name TEXT NOT NULL,
 answerer_email TEXT NOT NULL,
 reported BOOLEAN NOT NULL DEFAULT 'false',
 answer_helpful INT NOT NULL DEFAULT 0
);

CREATE TABLE stg_answers (
 id BIGSERIAL NOT NULL,
 question_id INTEGER NOT NULL,
 body TEXT NOT NULL,
 created BIGINT NOT NULL,
 answerer_name TEXT NOT NULL,
 answerer_email TEXT NOT NULL,
 reported BOOLEAN NOT NULL DEFAULT 'false',
 answer_helpful INT NOT NULL DEFAULT 0
);

ALTER TABLE answers ADD CONSTRAINT answers_pkey PRIMARY KEY (id);

CREATE TABLE photos (
 id BIGSERIAL NOT NULL,
 answer_id INTEGER NOT NULL,
 url TEXT NOT NULL
);

ALTER TABLE photos ADD CONSTRAINT photos_pkey PRIMARY KEY (id);

ALTER TABLE answers ADD CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES questions(id);
ALTER TABLE photos ADD CONSTRAINT photos_answer_id_fkey FOREIGN KEY (answer_id) REFERENCES answers(id);

COPY stg_questions (id, product_id, body, created, asker_name, asker_email, reported, question_helpful)
FROM '/Users/dan/hack-reactor/sdc-green-lantern/Questions-API/csv-files/questions.csv'
DELIMITER ','
CSV HEADER;

COPY stg_answers (id, question_id, body, created, answerer_name, answerer_email, reported, answer_helpful)
FROM '/Users/dan/hack-reactor/sdc-green-lantern/Questions-API/csv-files/answers.csv'
DELIMITER ','
CSV HEADER;

insert into questions
select
id, product_id, body,
to_timestamp(cast(created/1000 as bigint))::date,
asker_name, asker_email, reported, question_helpful
from stg_questions;

insert into answers
select
id, question_id, body,
to_timestamp(cast(created/1000 as bigint))::date,
answerer_name, answerer_email, reported, answer_helpful
from stg_answers;

COPY photos (id, answer_id, url)
FROM '/Users/dan/hack-reactor/sdc-green-lantern/Questions-API/csv-files/answers_photos.csv'
DELIMITER ','
CSV HEADER;

SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));
SELECT setval('answers_id_seq', (SELECT MAX(id) FROM answers));
SELECT setval('photos_id_seq', (SELECT MAX(id) FROM photos));

CREATE INDEX idx_product_id on questions (product_id);
CREATE INDEX idx_question_id on answers (question_id);
CREATE INDEX idx_answer_id on photos (answer_id);