const { Schema, model, Types } = require('mongoose')

const bookSchema = new Schema({
  title: { type: String, unique: true },
  author: String,
  pages: Number,
  createdBy: {
    type: Types.ObjectId,
    ref: 'User', // For example, it doesn't exist in this project
  },
})

const Book = model('Book', bookSchema)

module.exports = Book
