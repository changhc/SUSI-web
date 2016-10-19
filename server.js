var restify = require('restify');
var request = require('request');

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

server.get('/list.json', restify.serveStatic({
	directory: __dirname,
	default: './list.json'
}));

server.get(/\/?.*/, restify.serveStatic({
	directory: './public'
}));


server.post('/list', function(req, res, next){
	res.send(200);
	var data = JSON.stringify(req.params, null, 4);
    request({
        method: 'POST',
        uri: process.env.list_url,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'accept': 'application/json',
            'dataType': 'text'
        },
            
        body:  data
        },
        function (error, response, body) {
            if (error) {
                return console.error('upload failed:', error);
            }
            console.log(response.statusCode);
        });

});
