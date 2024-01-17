const express = require('express')
const mongoose = require('mongoose')
const Book = require('./models/Book.model')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/api/books', async (request, response) => {
  const books = await Book.find()

  response.json(books)
})

app.get('/api/books/:bookId', async (request, response) => {
  const { bookId } = request.params

  const oneBook = await Book.findById(bookId)

  response.json(oneBook)
})
/* If you don't have an ID, you could rely on a unique field
app.get('/api/books/:bookTitle', async (request, response) => {
  const { bookTitle } = request.params

  const oneBook = await Book.findOne({ title: bookTitle })

  response.json(oneBook)
}) */

app.post('/api/books', async (request, response) => {
  // Get back the data from the request
  console.log(request.body)
  const payload = request.body
  try {
    // Create the book
    const newBook = await Book.create(payload)
    // return the new book into the response
    response.status(201).json(newBook)
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      response.status(400).json({ error, message: 'Duplicate somewhere' })
    } else {
      response.status(500).json({ error, message: 'Somethin happened maybe on the server' })
    }
  }
})

app.put('/api/books/:bookId', async (request, response) => {
  console.log(request.body)
  const payload = request.body
  try {
    const updatedBook = await Book.findByIdAndUpdate(request.params.bookId, payload, { new: true })
    response.status(202).json(updatedBook)
  } catch (error) {
    console.log(error)
    response.status(500).json({ message: 'Something bad happened' })
  }
})

app.delete('/api/books/:bookId', async (request, response) => {
  const { bookId } = request.params
  try {
    const bookToDelete = await Book.findByIdAndDelete(bookId)
    response.status(202).json({ message: `${bookToDelete.title} was remove from the db` })
  } catch (error) {
    console.log(error)
    response.status(500).json({ message: 'Something bad happened' })
  }
})

/* const withDB = async () => {
  try {
    const x = await mongoose.connect('mongodb://127.0.0.1:27017/mongooseIntro')
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  } catch (error) {
    console.log('Problem connectin to the DB', error)
  }
}
withDB() */
mongoose
  .connect('mongodb://127.0.0.1:27017/mongooseIntro')
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    app.listen(5000, () => {
      console.log('Server running on http://localhost:5000')
    })
  })
  .catch(error => {
    console.log('Problem connectin to the DB', error)
  })
