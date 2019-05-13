const express = require("express");    //npm install express
const mongoose = require("mongoose");  //npm install mongoose
const bodyParser = require("body-parser");
//Server
const app = express();
const http = require("http").Server(app);  // connect http server with express server
// Connection to the MongoDB for todoApp with userid and pwd
const dbConnect = "mongodb+srv://todoAppuser:todoAppusertt@cluster0-gbm50.mongodb.net/test?retryWrites=true";
mongoose.connect(dbConnect,{useNewUrlParser: true }, (error) => {
	if (error) {
		console.log("There was an error connecting with MongoDB", error);
	} else {
		console.log("Connection to MongoDB successful!");
	}
});
// Copies JS Promise to mongoose. to understand what a JS promise is
mongoose.Promise = global.Promise;
let db = mongoose.connection;
// Tells mongoose what to do with MongoDB errors and also tells it to send it to the JS console.
db.on('error', console.error.bind(console, "MongoDB connection error: "));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/", express.static("./client"));  // reference to client folder

const port = 3000;
http.listen(port);
console.log(`Express is now running on port ${port}`);
// if Cannot GET / on local host 3000 you need index.html
// but not needed if using POSTMAN
//        ---------end of boiler plate static code
// Grabs a copy of the empty Mongoose Schema class.
let Schema = mongoose.Schema;
// Customizes our empty class into a custom class and stored in mySchema.
let todoSchema = new Schema({
	username: String,  // who created the todo item
	title: String,
	description: String, //description of the todo
	priority: String,  // number
	dueDate: String,  // must use Javascript Date Object number
	status: String,
	list: String
});
// model is keyword tells where to save it in mongoose  -- a class to make a new object notes- collection of documents  schema with properties
let todoModel = new mongoose.model("notes", todoSchema); // notes is the name of the collection, todoSchema is the Schema modelled off of the mongoose schema

//post handler for creating notes  CREATE
app.post("/createNote", (request, response) => {
	console.log(` request sends the following: ${request.body}`); // 2 see only the body message note if you dont specify .body it shows the entire object which is the packet itself
// mongodb object for database w/ the class above
	let newNote = todoModel({
		username: request.body.username,   // value input into POSTMAN
		title: request.body.title,
		description: request.body.description,
		priority: request.body.priority,
		dueDate: request.body.dueDate,
		status: request.body.status,
		list: null
	});
// save note object to mongodb
		newNote.save((error) => {
		responseState(error, response, 200);
		});

});

// read handler - listener
// R - READ  find  from CRUD for reading notes from the DB and sending to frontend
app.post("/readNotes", (request, response) => {

		todoModel.find({}, (error, results) => {
		responseState(error, response,  {notes: results});  // results is from the database of find method

});
// post handler for deletein g a note from the database
// D findByIdAndDelete -DELETE FROM CRUD - deleting a note from the database
app.post("/deleteNote", (request, response) => {
	//searches the mongodb by an id and then respectively delete that object

		todoModel.findByIdAndDelete(request.body._id, (error, results) => {
		responseState(error, response, {deleted: results});  // results here is object that is just deleted
	});
});


// post handler
		app.post("/updateNote", (request, response) => {  // post frontend

				let propertiesToUpdate = {
					username: request.body.username,
					title: request.body.title,
					description: request.body.description,
					priority: request.body.priority,
					dueDate: request.body.dueDate,
					status: request.body.status,
					list: null
				};

				todoModel.findByIdAndUpdate(request.body._id,propertiesToUpdate,(error, results) => {
						responseState(error, response, {updated: results});
				});

		});

// code abstraction

			function responseState(error, response, send) {
				if (error) {
					console.log("There was an issue with Mongoose ", error);
					response.sendStatus(500);
				} else {
					if (typeof send == "number"){
						response.sendStatus(send);  //status number
					} else if (typeof send == "object") {
						response.send(send);  //object
					}
				}

			}


/*
// Model lets us create a new database with the name messages and only allows the messageSchema types in this database.
let messageModel = new mongoose.model("messages", messageSchema);



// Post handler
app.post("/saveMessage", (req, res) => {

	let date = new Date();
	let allMessages;

	console.log(req.body.user);

	let newMessage = new messageModel({
		reallyCoolProp: "very important",
		user: req.body.user,
		message: req.body.message,
		timestamp: date.getTime()
	});

	newMessage.save((error) => {
		if (error) {
			console.log("There was an issue with Mongoose", error);
			res.sendStatus(500);
		} else {
			console.log("Document saved");


			messageModel.find({}, (error, results) => {
				console.log(results);
				allMessages = results;

				console.log(allMessages[3]._id);

				let objectToDelete = allMessages[3]._id;

				messageModel.findByIdAndDelete(objectToDelete, (error, results) => {
					console.log(error, results);
					console.log("The 4th item in the database was delete!");
				});

				let objectToUpdate = allMessages[0]._id;

				messageModel.findByIdAndUpdate( objectToUpdate, {user: "Phone"}, (error, results) => {
					console.log(error, results);
					console.log("The 1 first item was updated.");
				});



			});




			res.sendStatus(200);
		}
	});




});

*/
