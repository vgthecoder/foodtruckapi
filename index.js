const express = require('express');
const app = express();
const port = 5000;

const fs = require('node:fs');
var json = "";
fs.readFile('book.json', 'utf8', (err, data) => {json = JSON.parse(data);});

function searchExact(query) {
	if (json[caps(query)] != undefined) {
		return {err: "", results: 1, dishes: json[caps(query)]};
		// Thanks Gurglemurgle for improving the return statement here!
	} else {
		return {err:"Could not find that dish"};
	}
}

function searchAll() {
	return {err: "", results: Object.keys(json).length, dishes: json};
}

function searchName(query) {
	// Thanks Gurglemurgle for improving this whole code to make it work!
	if (query == "") {
		return {err: "Query was not defined"};
	}
	var results = {}
	var count = 0;
	for (var item in json) {
		if (item.includes(caps(query))) {
			count++
			results[item] = json[item];
		}
	}
	if (count > 0) {
		return {err: "", results: count, dishes: results};
	} else {
		return {err: "Could not find that dish"};
	}
}

function searchIngredient(query) {
	// Copy Pasted from searchName and edited
	if (query == "") {
		return {err: "Query was not defined"};
	}
	var results = {}
	var count = 0;
	for (var item in json) {
		if (json[item]["ing1"].includes(caps(query)) || json[item]["ing2"].includes(caps(query)) || json[item]["ing3"].includes(caps(query))) {
			count++
			results[item] = json[item];
		}
	}
	if (count > 0) {
		return {err: "", results: count, dishes: results};
	} else {
		return {err: "Could not find that dish, or query was not defined"};
	}
}

function searchLevel(query) {
	// Copy Pasted from searchName and edited
	if (query == "") {
		return {err: "Query was not defined"};
	}
	var results = {}
	var count = 0;
	for (var item in json) {
		if (caps(query) != "I" && caps(query) != "II" && caps(query) != "III" && json[item]["cat"].includes(query) || json[item]["cat"] == caps(query)) {
			count++
			results[item] = json[item];
		}
	}
	if (count > 0) {
		return {err: "", results: count, dishes: results};
	} else {
		return {err: "Could not find that dish, or query was not defined"};
	}
}

function caps(s) {
	if (s.toLowerCase() == "i" || s.toLowerCase() == "ii" || s.toLowerCase() == "iii") {
		return s.toUpperCase();
	}
	else {
		// Thank you some guy on stackoverflow
		return s
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
}

app.listen(port, () => {
	console.log(`Listening on port ${port}`)
});

app.get('/', (req, res) => {
	if ((req.query.type).toLowerCase() == "a") {res.send(searchAll()); return;}
	if ((req.query.type).toLowerCase() == "e") {res.send(searchExact(req.query.query)); return;}
	if ((req.query.type).toLowerCase() == "i") {res.send(searchIngredient(req.query.query)); return;}
	if ((req.query.type).toLowerCase() == "l") {res.send(searchLevel(req.query.query)); return;}
	if ((req.query.type).toLowerCase() == "n") {res.send(searchName(req.query.query)); return;}
	res.send({err:"Invalid type or No type was specified"});
});
