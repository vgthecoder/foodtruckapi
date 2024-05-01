const express = require('express');
const app = express();
const port = 5000;

const fs = require('node:fs');
var json = "";
fs.readFile('book.json', 'utf8', (err, data) => {json = JSON.parse(data);});

function searchExact(query) {
	if (json[caps(query)] != undefined) {
		return JSON.parse(`{"err":"", "results": "1", "dishes": {"${caps(query)}":${JSON.stringify(json[caps(query)])}}}`);
	} else {
		return JSON.parse('{"err":"Could not find that dish"}');
	}
}

function searchAll() {
	return JSON.parse(`{"err":"", "results": "${Object.keys(json).length}", "dishes":${JSON.stringify(json)}}`);
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
  console.log(`Example app listening on port ${port}`)
});

app.get('/foodtruck', (req, res) => {
	if (req.query.type == "e") {res.send(searchExact(req.query.query)); return;}
	if (req.query.type == "i") {res.send(json); return;}
	if (req.query.type == "l") {res.send(json); return;}
	if (req.query.type == "n") {res.send(json); return;}
	if (req.query.type == "a") {res.send(searchAll()); return;}
	res.send('{"err":"Invalid type specified"}')
});