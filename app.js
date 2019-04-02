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

      youTube.search(Query, 50, /*charset= utf-8,*/ function(error, result) {
      
       
        
             if (error) {
                   console.log(error);
                        }
             else {
             
              var convertedToJson = JSON.stringify(result, null, 10000)
              console.log(convertedToJson);
              
                      //var snippet = result.items[0].snippet;
                      
                    for (var i = 0; i < result.items.length; i++) {
                        //var items = result.items; 
                        var snippet=result.items[i].snippet;
                     
                     
                        
                        postvideo = new videosNews ({
                
                          title: snippet.title,
                         
                          videoId : result.items[i].id.videoId,
                          
                          description: snippet.description,
                          url: snippet.thumbnails.medium.url, //url= 'http://img.youtube.com/vi/'+ '${videoId}' + '/hqdefault.jpg',
                          
                          //lien : `https://www.youtube.com/watch?v=${videoId}`,
                         
                          publishedAt: snippet.publishedAt

                     })
                     module.exports = postvideo;
                    
                     postvideo.save(function(err, data){
                        if(err){console.log('rong')}
                        else {console.log('save')}
                            })
                     
                          
                  console.log(postvideo)

                          }      
            }
        })
          }
})


//********* The home page 
app.get('/page_d_accueil', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


/*app.get('/videoS', (req, res) => {
    videosNews.getVideosNews((err, videosNews) => {
      if(err){
        throw err;
      }
      res.json(videosNews);
    });
  });*/
  app.get('/videooS', (req, res) => {
    
       res.json(postvideo.toString("utf8"));
    });

  /*app.get('/getvideoss',(req,res)=>{
    // get all videos documents within our video collection
    // send back to user as json
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            res.json(documents);
        }
    });
});*/

// Create the server 
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
