import app from "./app.js";
import dbConnection from "./Config/dbConnection.js";
import http from "http";

const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
