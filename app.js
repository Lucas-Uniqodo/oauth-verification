const express = require("express");
const db = require("./database.js");
// const basicAuth = require("express-basic-auth");
const bcrypt = require("bcrypt");
const { auth } = require("express-oauth2-jwt-bearer");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
	audience: "messagesAPI",
	issuerBaseURL: `https://dev-6vmoiti6.us.auth0.com/`,
});

// initialise Express
const app = express();

// specify out request bodies are json
app.use(express.json());

// check for a basic auth header with correct credentials
// app.use(
// 	basicAuth({
// 		authorizer: dbAuthorizer, // customer authorizer,
// 		authorizeAsync: true, // we check the db which makes this async
// 		challenge: true,
// 		unauthorizedResponse: (req) => {
// 			return `unauthorized. ip: ${req.ip}`;
// 		},
// 	})
// );

// our custom async authorizer middleware, this is called for each request
// function dbAuthorizer(username, password, callback) {
// 	const sql = "select password from users where username = ?;";
// 	db.get(sql, [username], async (err, user) => {
// 		err ? callback(err) : bcrypt.compare(password, user.password, callback);
// 	});
// }

// This route needs authentication
app.get("/api/private", checkJwt, function (req, res) {
	res.json({
		message:
			"Hello from a private endpoint! You need to be authenticated to see this.",
	});
});

// return all messages
app.get("/messages", checkJwt, (req, res) => {
	const sql = "select * from messages";
	db.all(sql, [], (err, rows) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json(rows);
	});
});

// return the matching message
app.get("/messages/:id", checkJwt, (req, res) => {
	const sql = "select * from messages where id = ?";
	db.all(sql, req.params.id, (err, rows) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json(rows);
	});
});

// update a message
app.put("/messages/:id", checkJwt, (req, res) => {
	const sql = "update messages set message=? where id=?";
	const data = req.body;
	console.log(data);
	console.log(req.params.id);
	db.run(sql, [data.message, req.params.id], (err, rows) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.status(200).json({
			message: "success",
		});
	});
});

// create a new message
app.post("/messages", checkJwt, (req, res) => {
	const sql = "insert into messages (message) values(?)";
	const data = req.body;
	db.run(sql, [data.message], (err) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.status(201).json({
			message: "success",
		});
	});
});

// delete a message
app.delete("/messages/:id", checkJwt, (req, res) => {
	const sql = "delete from users where id = ?";
	db.all(sql, req.params.id, (err, rows) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: "success",
		});
	});
});

// default response for any other request
app.use(function (req, res) {
	res.status(404);
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
