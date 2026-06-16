const { GraphQLError } = require("graphql/error")
const Book = require("./models/book")
const Author = require("./models/author")
const book = require("./models/book")
const author = require("./models/author")

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        return Book.find({ author: args.author }).populate("author")
      }
      if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate("author")
      }
      return Book.find({}).populate("author")
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: async (author) => Book.countDocuments({ author: author._id }),
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          if (error.name === "ValidationError") {
            throw new GraphQLError(`Adding author failed: ${error.message}`, {
              extensions: {
                code: "GRAPHQL_VALIDATION_FAILED",
                invalidArgs: args.author,
                error,
              },
            })
          }
        }
      }
      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
        return await book.populate("author")
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError(`Adding book failed: ${error.message}`, {
            extensions: {
              code: "GRAPHQL_VALIDATION_FAILED",
              invalidArgs: args.title,
              error,
            },
          })
        }
      }
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      return author.save()
    },
  },
}

module.exports = resolvers
