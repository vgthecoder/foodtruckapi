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
    let results = {}
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

function caps(s) {
	var tmp = s.split(' ');
	var tmp2 = 0;
	var tmp3 = "";
	if (s.toLowerCase() == "ii" || s.toLowerCase() == "iii") {
		return s.toUpperCase();
	}
	else {
		for (var tmp2 in tmp) {
			tmp3 += " " + tmp[tmp2][0].toUpperCase() + tmp[tmp2].slice(1);
		}
		return tmp3.slice(1);
	}
}

app.listen(port, () => {
	console.log(`Listening on port ${port}`)
});

app.get('/', (req, res) => {
	if (req.query.type == "e") {res.send(searchExact(req.query.query)); return;}
	if (req.query.type == "i") {res.send(json); return;}
	if (req.query.type == "l") {res.send(json); return;}
	if (req.query.type == "n") {res.send(searchName(req.query.query)); return;}
	if (req.query.type == "a") {res.send(searchAll()); return;}
	res.send({err:"Invalid type or No type was specified"});
});
