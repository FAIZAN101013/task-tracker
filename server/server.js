import express from "express"; // import express module
import cors from "cors";// import cors module
import dotenv from "dotenv";// import dotenv module

dotenv.config(); // this line loads environment variables from a .env file into process.env

const app = express(); // this line creates an instance of an Express application a app is created

app.use(cors()); // add cors middleware to the application to enable cross-origin resource sharing
app.use(express.json()); // add express.json middleware to the application to parse incoming JSON requests

app.get("/",(req ,res)=>{
    res.send("task tracker api is running"); // this line defines a route for the root URL ("/") of the application. When a GET request is made to this URL, the server responds with the message "task tracker api is running"
});

const PORT = process.env.PORT || 5000; // this line sets the port number for the server to listen on. It first checks if there is a PORT environment variable defined, and if not, it defaults to 5000.

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);// this line starts the server and listens for incoming requests on the specified port. When the server is successfully running, it logs a message to the console indicating the port number.
});