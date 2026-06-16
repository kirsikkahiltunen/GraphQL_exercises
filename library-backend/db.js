const mongoose = require("mongoose")

const connectToDatabase = async (uri) => {
  console.log("connecting to db:", uri)
  try {
    await mongoose.connect(uri)
    console.log("connected to db")
  } catch (error) {
    console.log("failed to connect to the db:", error.message)
    process.exit(1)
  }
}

module.exports = connectToDatabase
