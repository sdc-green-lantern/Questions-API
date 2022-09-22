
const questionSchema = new mongoose.Schema({
  id: Number,
  question_id: Number,
  body: String,
  created: Date,
  asker_name: String,
  asker_email: String,
  reported: Boolean,
  question_helpful: Boolean
})

const Questions = mongoose.model('Questions', questionSchema)

const answerSchema = new mongoose.Schema({
  id: Number,
  question_id: Number,
  body: String,
  created: Date,
  asker_name: String,
  asker_email: String,
  reported: Boolean,
  question_helpful: Boolean
})

const Answers = mongoose.model('Answers', answerSchema)

const photoSchema = new mongoose.Schema({
  id: Number,
  answer_id: Number,
  url: String
})

const Photos = mongoose.model('Photos', photoSchema)

const userSchema = new mongoose.Schema({
  id: Number,
  question_id: Number,
  answer_id: Number,
  marked_helpful: Boolean
})

const Users = new mongoose.Schema('users', userSchema)