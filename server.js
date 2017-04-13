var restify = require('restify');
var request = require('request');
var azure = require('azure-storage');

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
    if (req.params.pass !== process.env.PASSCODE) {
        res.send(401);
        return;
    }
    var data = JSON.stringify(req.params.msg, null, 4);
    console.log(data)
    
    var blobSvc = azure.createBlobService(process.env.STORAGE_ACCOUNT, process.env.STORAGE_ACCESS_KEY, process.env.HOST);
        
    blobSvc.createBlockBlobFromText(process.env.CONTAINER_NAME, 'list', data, {"contentType": "application/json"}, (error, blockBlob) => {
        if (error) {
            console.error(error);
            res.send(500);
        }
        console.log(blockBlob);
        res.send(200);
    });
    
});
