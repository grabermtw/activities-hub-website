var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var moment = require('moment');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var marked = require('marked');
var schemas = require('./models/activity');
var Activity = schemas.activity;

var app = express();

// Load environment variables
dotenv.load();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));
var dataUtil = require("./data-utils");

//OLD!!!!
//var _DATA = dataUtil.loadData().food_reviews;
//var foods = [];
//_DATA.forEach(element => foods.push(element.name));

//Activities data
var act_DATA;
Activity.find({},function(err, myActivities){
  if(err) throw err
  act_DATA = myActivities;
})

// Connect to MongoDB
console.log(process.env.MONGODB)
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function () {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});


// FROM THE MIDTERM REQUIREMENTS:
/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

app.get('/', function (req, res) {
  Activity.find({},function(err, myActivities){
    if(err) throw err
    act_DATA = myActivities;
  });
  res.render("home", { data: act_DATA, search_msg: "Not finding what you're looking for? Be the first to add that activity!" });
});


// -- SORT OF DONE? -- The "finding a random activity" part should theoretically work, how that data gets used/passed in can be changed
app.get('/random', function (req, res) {
  //get random number to skip through
  var rando = Math.floor(Math.random() * Activity.estimatedDocumentCount());

  res.render("home", { data: [Activity.findOne().skip(rando)] })
})

// -- DONE -- renders page to create a new activity (that page is not done)
app.get("/create", function (req, res) {
  res.render('create');
});

// -- DONE -- adds new activity via postman
app.post('/api/add/activity', function(req, res) {
  var activity = new Activity({
      name: req.body.name,
      description: req.body.description,
      where: req.body.where,
      when: req.body.when,
      author: req.body.author,
      comments: []
  })

  activity.save(function(err) {
      if(err) throw err
      return res.send("Activity uploaded!")
  })
});

// -- DONE -- adds new activity from Add Activity page
app.post('/add/activity', function(req, res) {
  var activity = new Activity({
      name: req.body.name,
      description: req.body.description,
      where: req.body.where,
      when: req.body.when,
      author: req.body.author,
      comments: []
  })

  activity.save(function(err) {
      if(err) throw err
      Activity.find({},function(err, myActivities){
        if(err) throw err
        act_DATA = myActivities;
      });
      res.redirect("/");
  })
});

// -- DONE -- adds new comment to an activity by ID
app.post('/api/add/activity/:id/comment', function (req, res) {

  Host.findOne({ _id: req.params.id }, function (err, activity) {
    if (err) throw err
    if (!activity) return res.send("No activity of id exists")
    var comment = {
      hypeRating: parseFloat(req.body.hypeRating),
      comment: req.body.comment,
      author: req.body.author,
    }
    /* mongo $pushAll is deprecated (mongoose.push builds ontop of $pushall)
        instead we use .concat()
    */
    activity.comments = activity.comments.concat([comment])
    activity.save(function (err) {
      if (err) throw err
      return res.send("Comment added to the activity!")
    })
  });
});


// -- DONE -- deletes activity by ID
app.delete('/api/activity/:id', function(req, res) {
  Movie.findByIdAndRemove(req.param.id, function(err, activity){
      if(!activity) return res.send("Not Deleted")
      res.send("Deleted")
  })
});

// -- DONE --
let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}!`);
});
