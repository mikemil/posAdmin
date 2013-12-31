var express = require('express');
var appevent = require('./routes/appevent');
var http = require('http');
var path = require('path');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/appevents', appevent.getAll);
app.get('/sysevents', appevent.getSysEvents);
app.get('/appevents/:id', appevent.getId);
app.get('/applications', appevent.getApplications);
app.get('/locations', appevent.getLocations);
app.get('/terminals', appevent.getTerminals);
app.get('/processes', appevent.getProcesses);
app.get('/prochist', appevent.getProcessHistory);


http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});