var express = require('express'), 
bodyParser = require('body-parser'), 
http = require('http'), 
request = require('request'), 
Promise = require('promise');
require('dotenv').load();
app = express();
app.use(bodyParser());
app.use('/', express.static('./client'));
var username = process.env.USER;
var password = process.env.PASSWORD;
var instance = process.env.DEV;
var prod = process.env.PROD;
app.set('port', (process.env.PORT || 5000))

var returnRequest = function() {	
	return new Promise(function(resolve, reject){
	var hostname = "https://" + instance + ".service-now.com/sys_update_set.do?JSONv2&sysparm_action=getRecords&sysparm_query=name!=Default^ORDERBYDESCsys_updated_on&displayvalue=true";
	request.get(hostname, function(error, response, body){
		if (error) {
			reject(error);
		}
		var parsed = JSON.parse(body);
		if (parsed) {
			var records = parsed.records;
			resolve(records);
		} else {
			console.log("Error parsing JSON");
		}
	}).auth(username, password, false);
	});
}

var createMigration = function(inputData) {
	username = inputData[0].username;
	password = inputData[0].password;
	return new Promise(function(resolve, reject) {		
		var hostname = "https://" + instance + "scrippsdev.service-now.com/kb_knowledge.do?JSON&sysparm_action=insert";		
		var text = '', shortDesc = 'Migration Plan - ' + inputData[0].changeNumber + ' - ServiceNow Release ' + inputData[0].releaseNumber;
		var tableStart = "<table border='1px solid #000;'><tr><td>Number</td><td>Name</td><td>Description</td><td>State</td><td>Opened By</td><td>Closed By</td><td>Closed On</td><td>Rally</td></tr>";
		var tableBody = '';
		var tableEnd = "</table>";
		for (var input in inputData) {
			text += "<h1>Update Set: <u>" + inputData[input].name + "</u> Steps</h1><br/>"
			tableBody += "<tr><td>" + (parseInt(input) + 1) + "</td>" +
					"<td>" + inputData[input].name + "</td>" +
					"<td>" + inputData[input].description + "</td>" +
					"<td>" + inputData[input].state + "</td>" +
					"<td>" + inputData[input].opened_by + "</td>" +
					"<td>" + inputData[input].closed_by + "</td>" +
					"<td>" + inputData[input].closed_on + "</td>" +
					"<td><a href='" + inputData[input].rally + "'>Link</a></tr>";
			text += inputData[input].migration_plan + "<br/>"
		}	
		var heading = "<h1><a target='_blank' href='https://" + prod + ".service-now.com/change_request.do?sysparm_query=number=" + inputData[0].changeNumber + "'>" + shortDesc + '</a></h1>';
		var finalText =  heading + tableStart + tableBody + tableEnd + text;
		var knowledgeArticle = {text : finalText, short_description : shortDesc};
		var options = {
			uri : hostname,
			method : 'POST',
			json : knowledgeArticle
		};
		request(options, function(error, response, body){
			if (error) {
				reject(error);
			}
			resolve(response);
		}).auth(username, password, false);
	});
}

app.post('/updatesets/migration', function(req, res){
	var promiseObject = createMigration(req.body)
		.then(function(response){
			res.json(response);
		});
});

app.get('/updatesets/names', function(req, res){
	var promiseObject = returnRequest()
		.then(function(names){
			res.json(names);
		});
});

app.listen(app.get('port'));