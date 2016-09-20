var restify = require('restify');
var fs = require('fs');

var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.CORS());
server.listen(process.env.PORT || process.env.port || 3000, function() 
{
   console.log('%s listening to %s', server.name, server.url); 
});

server.get('/', restify.serveStatic({
	directory: __dirname,
	default: './public/index.html'
}));

server.get(/\/?.*/, restify.serveStatic({
	directory: './public'
}));

server.get('/list.json', restify.serveStatic({
	directory: __dirname,
	default: './list.json'
}));

server.post('/list', function(req, res, next){
	res.send(200);
	var data = JSON.stringify(req.params, null, 4);
	fs.writeFile('./list.json', data, function(err){
		if(err) return console.log(err);
		console.log(data);
	});
});