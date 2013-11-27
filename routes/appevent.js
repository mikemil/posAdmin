
/*
 * GET app events
 */

var database = require('mysql-simple');
// Port number is optional
database.init('root', 'root', 'dev_store_trunk', 'localhost', 3306);

exports.getAll = function(req, res){
    var queryParms = [
    	{name: 'application', colName: 'APPLICATION_ID=?',   	  type: 'int'},
    	{name: 'location',    colName: 'LOCATION_NUMBER=?', 	  type: 'string'},
    	{name: 'terminal',    colName: 'TERMINAL_NAME=?',   	  type: 'string'},
    	{name: 'eventtype',   colName: 'EVENT_TYPE_ID=?',   	  type: 'int'},
    	{name: 'associate',   colName: 'EVENT_ASSOCIATE_NUMBER=?',type: 'string'},
    ];

   	var baseSql = 'SELECT * FROM APPLICATION_EVENT';
   	var queryClause = ' WHERE ';
    var values = [];

    for(key in queryParms) {
    	if (req.query[queryParms[key].name]) {
    		if (values.length> 0) queryClause += ' AND ';  	 
    		queryClause += queryParms[key].colName;
   			values.push( queryParms[key].type === 'int' ? parseInt(req.query[queryParms[key].name]) : req.query[queryParms[key].name] );
    	}
    }
    var sql = baseSql;
    if (values.length > 0)  {
    	sql += queryClause;
    }

   	sql += ' LIMIT  ?';
   	values.push(parseInt(req.query.limit));
   	console.log('sql stmt:'+sql);

   	execQuery(sql, values, res);
};

function execQuery(sql, values, res) {
	database.query(sql, values,  
	  function(err, results, fields)
	{
	  if (err) {
	    console.log('error:'+ err +' executing query: ' + sql);
	    return;
	  }
	  res.json(results);
	});	
}

exports.getId = function(req, res){
	execQuery('SELECT * FROM APPLICATION_EVENT WHERE APPLICATION_EVENT_ID=?', [req.params.id], res);
};

exports.getApplications = function(req, res){
	execQuery('SELECT A.APPLICATION_ID, I.NAME FROM APPLICATION A, APPLICATION_I18N I WHERE A.APPLICATION_ID=I.APPLICATION_ID AND I.LANGUAGE=?', ['en'], res);
};

exports.getLocations = function(req, res){
	execQuery('SELECT A.PARTY_ID, A.LOCATION_NUMBER FROM LOCATION A, LOCATION_I18N I WHERE A.PARTY_ID=I.PARTY_ID AND I.LANGUAGE=?', ['en'], res);
};

exports.getTerminals = function(req, res){
	execQuery('SELECT TERMINAL_ID, TERMINAL_NAME FROM TERMINAL', [], res);
};

exports.getProcesses = function(req, res){
	execQuery('SELECT P.PROCESS_ID, I.NAME FROM PROCESS P, PROCESS_I18N I WHERE P.PROCESS_ID=I.PROCESS_ID AND I.LANGUAGE=?', ['en'], res);
};

exports.getProcessHistory = function(req, res){
    var queryParms = [
    	{name: 'businessdate', colName: 'BUSINESS_DATE=?', type: 'string'},
    ];

   	var baseSql = 'SELECT * FROM PROCESS_HISTORY';
   	var queryClause = ' WHERE ';
    var values = [];

    for(key in queryParms) {
    	if (req.query[queryParms[key].name]) {
    		if (values.length> 0) queryClause += ' AND ';  	 
    		queryClause += queryParms[key].colName;
   			values.push( queryParms[key].type === 'int' ? parseInt(req.query[queryParms[key].name]) : req.query[queryParms[key].name] );
    	}
    }
    var sql = baseSql;
    if (values.length > 0)  {
    	sql += queryClause;
    }

   	sql += ' LIMIT  ?';
   	values.push(parseInt(req.query.limit));
   	console.log('sql stmt:'+sql);

   	execQuery(sql, values, res);
};