var app = require('express')();
var http = require('http');
const fetch = require('node-fetch');
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/fertilizer/dist/fertilizer')));

http.Server(app);


let favCityByUser = { };

// ########## static files ##########

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.get('/lab3.css',function(req,res){
    res.sendFile(__dirname+'/lab3.css');
});

app.get('/jquery.js',function(req,res){
    res.sendFile(__dirname+'/jquery.js');
});

app.get('/lab3.js',function(req,res){
    res.sendFile(__dirname+'/lab3.js');
});

app.get('/background',function(req,res){
    res.sendFile(__dirname+'/25-252076_background-image-for-weather-app.jpg');
});
// ########## static files ##########
// TODO find better ways of serving static files


// /geo?lat=&lon=
app.get('/v1/geo', function (req, res) {
    let query = req.query;
    if (query['lat'] == undefined | query['lat'] =='' || query['lon'] == undefined | query['lon'] =='')
        res.status(403).end()
    else {
        let lat = query['lat'];
        let lon = query['lon'];
        
        http.get('http://api.weatherapi.com/v1/current.json?key=a14e9405e8174749a7601728210203&q='+lat+','+lon, (response) => {
            let data = '';
          
            // A chunk of data has been received.
            response.on('data', (chunk) => {
              data += chunk;
            });
          
            // The whole response has been received. Print out the result.
            response.on('end', () => {
              console.log(JSON.parse(data));
              res.end(data);
            });
          
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
})

// /city?city=
app.get('/v1/city', function (req, res) {
    let query = req.query;
    if (query['city'] == undefined | query['city'] =='')
        res.status(403).end()
    else {
        let city = query['city'];
        
        http.get('http://api.weatherapi.com/v1/current.json?key=a14e9405e8174749a7601728210203&q='+city, (response) => {
            let data = '';
          
            // A chunk of data has been received.
            response.on('data', (chunk) => {
              data += chunk;
            });
          
            // The whole response has been received. Print out the result.
            response.on('end', () => {
              console.log(JSON.parse(data));
              res.end(data);
            });
          
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
})

// /favcity
app.get('/v1/users/favcity', function (req, res) {
    let query = req.query;
    if (query['uid'] == undefined | query['uid'] =='')
        res.status(403).end()
    else {
        let uid = query['uid'];
        if (favCityByUser[uid] == undefined)
            res.end(JSON.stringify('[]'))
        else
            res.end(JSON.stringify(favCityByUser[uid]));
    }
})

app.put('/v1/users/favcity', function (req, res) {
    let query = req.query;
    console.log(query);
    if (query['uid'] == undefined | query['uid'] == '' || query['cities'] == undefined | query['cities'] == [])
        res.status(403).end()
    else {
        let uid = query['uid'];
        let cities = query['cities'];
        if (favCityByUser[uid] == undefined) {
            favCityByUser[uid] = cities;
            res.end(JSON.stringify(favCityByUser[uid]));            
        }
        else {
            cities.forEach(city => {
                let found = false;
                for (var i = 0; i < favCityByUser[uid].length; i++) {
                    if (favCityByUser[uid][i] == city) {
                        found = true;
                        break;
                    }
                }
                if (found == false) {
                    favCityByUser[uid].push(city);
                }
            });
            res.end(JSON.stringify(favCityByUser[uid]));            
        }
    }
})

app.post('/v1/users/favcity', function (req, res) {
    let query = req.query;
    console.log(query);
    if (query['uid'] == undefined | query['uid'] == '' || query['city'] == undefined | query['city'] == '')
        res.status(403).end()
    else {
        let uid = query['uid'];
        let city = query['city'];
        if (favCityByUser[uid] == undefined) {
            favCityByUser[uid] = [city];
            res.end(JSON.stringify(favCityByUser[uid]));            
        }
        else {
            let found = false;
            for (var i = 0; i < favCityByUser[uid].length; i++) {
                if (favCityByUser[uid][i] == city) {
                    found = true;
                    break;
                }
            }
            if (found == false) {
                favCityByUser[uid].push(city);
            }
            res.end(JSON.stringify(favCityByUser[uid]));            
        }
    }
})

app.delete('/v1/users/favcity', function (req, res) {
    let query = req.query;
    if (query['uid'] == undefined | query['uid'] =='')
        res.status(403).end()
    else {
        let uid = query['uid'];
        if (favCityByUser[uid] != undefined)
            delete favCityByUser[uid];
        res.end();
    }
})

app.listen(3000,function(){
    console.log("success");
});
