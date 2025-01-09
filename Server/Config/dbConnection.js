// Requiring all the important packages
import mongoose from "mongoose";

// Getting the environment variables
import dotevn from "dotenv";
dotevn.config();

// Creating the custom class of Database to connect to the database
class Database {
  // Constructor calling the connect function as soon as its object is created
  constructor() {
    this.connect();
  }

  // Connect method to connect to the database
  connect() {
    mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => console.log("Database Connection Successfull"))
      .catch((err) =>
        console.log(`Could not connect to the database. ${err.message}`)
      );
  }
}

// Exporting the object of the Database class
export default new Database();
