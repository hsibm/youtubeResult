var express = require('express');
var app = express();
var cors = require('cors');
const utf8 = require ( 'utf8' ) ;
var mongoose = require('mongoose');


var postvideo
var bodyParser = require('body-parser');
var YouTube = require('youtube-node');//**
videosNews =require('./modeles/videoModele');
var videosjNews =require('./youtubeResult.js')
var Query;
var savedata;
var youTube;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))


const PORT = 2000

//******** Create new database and make connection with it
const mongooseConnection = mongoose.createConnection('mongodb://localhost:27017/veille',{useNewUrlParser:true});

mongooseConnection.on('error', function () {
console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

mongooseConnection.on('connected', function () {
console.error('Connected to MongoDB.');
});

const corsOptions = {
origin: 'http://localhost:2000/',
optionsSuccessStatus: 200
};

//******** Enable CORS Requests
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

//******** Youtube API
app.post('/video', function(req,res){
console.log(req.body.query)
//Check if query string is empty/all spaces if so redirect to homepage
if(req.body.query === undefined || req.body.query.trim() === "")
res.redirect('/page_d_accueil');

else {
Query = req.body.query;//Set Query
youTube = new YouTube();
//var req = utf8.encoding(Query);

console.log(req)
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
youTube.addParam('order', 'date');
youTube.addParam('type', 'video');


youTube.search(Query,50,  function(error, result) {

function savedata (index) {
var items = result["items"];
for (var i in items) { 
var it = items[i];
var title = it["snippet"]["title"];
var video_id = it["id"]["videoId"];
var url = "https://www.youtube.com/watch?v=" + video_id;
var publishedAt= it["snippet"]["publishedAt"];
var description= it["snippet"]["description"];

var img = it["snippet"]["thumbnails"]["medium"]["url"]; // var img = "http://img.youtube.com/vi/"+ video_id + "/hqdefault.jpg";


postvideo = new videosNews ({


"title": title, "description": description, "imgUrl": img, "url":url, "publishedAt": publishedAt,
});
postvideo.save(function(err, res){
if(err){console.log('rong')}
else {console.log('save')}
})


console.log(postvideo)


} 

}



if (error) {
console.log(error);
}
else {
return savedata();

//var convertedToJson = JSON.stringify(result, null, 10000)
//console.log(convertedToJson);


}
})
}
})


//********* The home page 
app.get('/page_d_accueil', function (req, res) {
res.sendFile(__dirname + '/index.html');
});



app.get('/videooS', (req, res) => {


res.json(postvideo);
// object.value(postvideo)
});


// Create the server 
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
