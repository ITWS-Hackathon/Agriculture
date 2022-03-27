var app = require('express')();
var http = require('http');
const fetch = require('node-fetch');
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/fertilizer/dist/fertilizer')));

http.Server(app);



app.get('/background',function(req,res){
    res.sendFile(__dirname+'/25-252076_background-image-for-weather-app.jpg');
});
// ########## static files ##########
// TODO find better ways of serving static files






app.listen(3000,function(){
    console.log("success");
});
