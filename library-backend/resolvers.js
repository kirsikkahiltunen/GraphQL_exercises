const { GraphQLError } = require("graphql/error")
const jwt = require("jsonwebtoken")
const Book = require("./models/book")
const Author = require("./models/author")
const User = require("./models/user")

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    me: (root, args, context) => {
      return context.currentUser
    },
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
    addBook: async (root, args, context) => {
      let author = await Author.findOne({ name: args.author })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        })
      }
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
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({ name: args.name })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        })
      }
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      return author.save()
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      return user.save().catch((error) => {
        throw new GraphQLError(`Creating new user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong password or username", {
          rxtensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }
      const userToken = {
        id: user._id,
        username: user.username,
      }

      return { value: jwt.sign(userToken, process.env.SECRET) }
    },
  },
}

module.exports = resolvers
