const { GraphQLError } = require("graphql/error")
const Book = require("./models/book")
const Author = require("./models/author")
const book = require("./models/book")
const author = require("./models/author")

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: async (root, args) => {
      if (args.author) {
        return Book.find({ author: args.author })
      }
      if (args.genre) {
        return books.filter((book) => book.genres.includes(args.genre))
      }
      return Book.find({}).populate("author")
    },
    allAuthors: () => authors,
  },
  Author: {
    bookCount: (author) =>
      books.filter((book) => book.author === author.name).length,
  },
  Mutation: {
    addBook: async (root, args) => {
      try {
        let author = await Author.findOne({ name: args.author })
        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }
        const book = new Book({ ...args, author: author._id })
        await book.save()
        return await book.populate("author")
      } catch (error) {
        throw new GraphQLError(`Adding book failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        })
      }
    },
    editAuthor: (root, args) => {
      const author = authors.find((author) => author.name === args.name)
      if (!author) {
        return null
      }

      const updatedAuthor = { ...author, name: args.name, born: args.setBornTo }
      authors = authors.map((author) =>
        author.name === args.name ? updatedAuthor : author,
      )
      return updatedAuthor
    },
  },
}

module.exports = resolvers
