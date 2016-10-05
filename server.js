var restify = require('restify');
var fs = require('fs');
var request = require('request');

var file = fs.readFileSync('./list.json').toString();
var list = JSON.parse(file);
var auth = "Basic " + new Buffer("admin:admin").toString("base64");
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
	fs.writeFile('./list.json', data, function(err){
		if(err) return console.log(err);
		console.log(data);
	});
});

setInterval(function(){
    for(item = 0; item < list.length; ++item){
        var list_item = list[item];
        var req_body = '{"request": {"item": ' + JSON.stringify(list_item) + '}}';
        request({
            method: 'POST',
            uri: 'http://susi.eastasia.cloudapp.azure.com/webresources/DeviceCtl/getDeviceDataRT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'accept': 'application/json',
                'dataType': 'text',
                'Authorization': auth
            },
                
            body:  req_body
            },
            function (error, response, body) {
                if (error) {
                    return console.error('upload failed:', error);
                }

                var result = JSON.parse(body).result.itemList;
                for(i = 0; i < result.length; ++i){
                    var tmp = result[i].ts;
                    result[i].agentId = list_item.agentId;
                    delete result[i].statusCode;
                    result[i].ts = tmp.substring(0, tmp.length - 4);
                }
                result = JSON.stringify(result);

                request({
                    method: 'POST',
                    uri: 'https://func-test.azurewebsites.net/api/HttpTriggerNodeJS1?code=8fnhrx93ubc7oyf419eieifkddt07dzb7dwr',
                    headers:{
                        'Content-Type': 'application/json; charset=utf-8',
                        'dataType': 'text'
                    },
                        
                    body: result
                    },
                    function (error, response, body) {
                        if (error) {
                            return console.error('upload failed:', error);
                        }
                        //console.log(body);
                });

                //to power bi
                request({
                    method: 'POST',
                    uri: 'https://api.powerbi.com/beta/72f988bf-86f1-41af-91ab-2d7cd011db47/datasets/5a877557-ff40-4e24-ab65-caff45fd7fac/rows?key=UGLvA5MtVDEPTKwWjb1JfefE7df3uq2Zwf%2BZNxvkUGmtAhNMY2ozeP4%2BHRRXHMfTvt6TuiOouLEcMFjZ21qzlg%3D%3D',
                    headers:{
                        'Content-Type': 'application/json; charset=utf-8',
                        'dataType': 'text'
                    },
                        
                    body: result
                    },
                    function (error, response, body) {
                        if (error) {
                            return console.error('upload failed:', error);
                        }
                        console.log("PowerBI ");
                });

                //console.log(result);
        });
    }

    //console.log("Hello!");
}, 1000);