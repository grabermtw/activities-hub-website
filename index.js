var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var moment = require('moment');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var marked = require('marked');
var schemas = require('./models/activity');
var boundten = require('./boundbyten');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Activity = schemas.activity;
var Group = schemas.group;

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

// Activities data
var act_DATA;
Activity.find({}, function (err, myActivities) {
  if (err) throw err
  act_DATA = myActivities;
});

// Group Data
var group_DATA;
Group.find({}, function (err, myGroups) {
  if (err) throw err;
  group_DATA = myGroups;
});

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
  Activity.find({}, function (err, myActivities) {
    if (err) throw err
    act_DATA = myActivities;
  });
  res.render("home", { data: act_DATA, search_msg: "Not finding what you're looking for? Be the first to add that activity!" });
});


// -- THEORETICALLY THIS SHOULD WORK -- need to use something other than estimatedDocumentCount(), it doesn't like that for somereason.
// check the mongoose documentation
app.get('/random', function (req, res) {

  Activity.find({}, function (err, myActivities) {
    if (err) throw err
    act_DATA = myActivities;
  });
  var rand = Math.floor(Math.random() * Math.floor(act_DATA.length));
  res.render("home", { data: [act_DATA[rand]] })
})

// Displays the activity with the most comments
app.get('/most', function (req, res) {
  var max = 0;
  var most = [];
  for (var i = 0; i < act_DATA.length; i++) {
    if (act_DATA[i].comments.length > max) {
      max = act_DATA[i].comments.length;
      most = [];
      most.push(act_DATA[i]);
    }
    else if (act_DATA[i].comments.length === max) {
      most.push(act_DATA[i]);
    }
  }
  res.render("home", { data: most })
})

// Displays the activities with the least comments
app.get('/least', function (req, res) {
  var min = act_DATA[0].comments.length;
  var least = [];
  for (var i = 0; i < act_DATA.length; i++) {
    if (act_DATA[i].comments.length < min) {
      min = act_DATA[i].comments.length;
      least = [];
      least.push(act_DATA[i]);
    }
    else if (act_DATA[i].comments.length === min) {
      least.push(act_DATA[i]);
    }
  }
  res.render("home", { data: least })
})

// Displays best-rated activity
app.get("/best/", function(req, res) {
  var max = 0;
  var best = [];
  for(var i = 0; i < act_DATA.length; i++){
    if (act_DATA[i].hype > max){
      max = act_DATA[i].hype;
      best = [];
      best.push(act_DATA[i]);
    }
    else if (act_DATA[i].hype === max){
      best.push(act_DATA[i]);
    }
  }
  res.render("home",{data: best})
});


// GETS best-rated activity
app.get("/api/best/", function(req, res) {
  var max = 0;
  var best = [];
  for(var i = 0; i < act_DATA.length; i++){
    if (act_DATA[i].hype > max){
      max = act_DATA[i].hype;
      best = [];
      best.push(act_DATA[i]);
    }
    else if (act_DATA[i].hype === max){
      best.push(act_DATA[i]);
    }
  }
  res.json(best);
});


// GETS the worst-rated activity
app.get("/worst/", function(req, res) {
  var min = act_DATA[0].hype;
  var worst = [];
  for(var i = 0; i < act_DATA.length; i++){
    if (act_DATA[i].hype < min){
      min = act_DATA[i].hype;
      worst = [];
      worst.push(act_DATA[i]);
    }
    else if (act_DATA[i].hype === min){
      worst.push(act_DATA[i]);
    }
  }
  res.render("home",{data: worst})
})


// GETS the worst-rated activity
app.get("/api/worst/", function(req, res) {
  var min = act_DATA[0].hype;
  var worst = [];
  for(var i = 0; i < act_DATA.length; i++){
    if (act_DATA[i].hype < min){
      min = act_DATA[i].hype;
      worst = [];
      worst.push(act_DATA[i]);
    }
    else if (act_DATA[i].hype === min){
      worst.push(act_DATA[i]);
    }
  }
  res.json(worst)
})

// -- DONE -- renders page to create a new activity (that page is not done)
app.get("/add/activity", function (req, res) {
  res.render('create');
});

app.get("/add/group", function (req, res) {
  res.render('create_group');
});

app.get("/chat", function (req, res) {
  res.render('chat');
});

app.get("/groups", function (req, res) {
  res.render("view_groups", { data: group_DATA })
});

// -- DONE -- adds new activity via postman
app.post('/api/add/activity', function (req, res) {
  console.log(req.body.name);
  var activity = new Activity({

    name: req.body.name,
    hype: 0,
    description: req.body.description,
    where: req.body.where,
    when: req.body.when,
    author: req.body.author,
    comments: []
  })

  activity.save(function (err) {
    if (err) throw err
    return res.send("Activity added!")
  })
});

// -- DONE -- adds new activity from Add Activity page
app.post('/add/activity', function (req, res) {
  var activity = new Activity({
    name: req.body.name,
    hype: 0,
    description: req.body.description,
    where: req.body.where,
    when: req.body.when,
    author: req.body.author,
    comments: []
  })

  activity.save(function (err) {
    if (err) throw err
    Activity.find({}, function (err, myActivities) {
      if (err) throw err
      act_DATA = myActivities;
    });
    res.redirect("/");
  })
});

// add new group from Add Group page
app.post('/add/group', function (req, res) {
  var group = new Group({
    name: req.body.name,
    description: req.body.description,
    memberCount: req.body.membercount,
    location: req.body.location,
    contactInfo: req.body.contact
  })

  group.save(function (err) {
    if (err) throw err
    Group.find({}, function (err, myGroups) {
      if (err) throw err
      group_DATA = myGroups;
    });
    res.redirect("/");
  })
});

// add new group via POST request
app.post('/api/add/group', function (req, res) {
  var group = new Group({
    name: req.body.name,
    description: req.body.description,
    memberCount: req.body.membercount,
    location: req.body.location,
    contactInfo: req.body.contact
  })

  group.save(function (err) {
    if (err) throw err
    return res.send("Group added!")
  })
});

// -- DONE -- adds new comment to an activity by ID from Main.Handlebars
app.post('/add/activity/:id/comment', function (req, res) {

  Activity.findOne({ _id: req.params.id }, function (err, activity) {
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
    
    //CALCULATE NEW RATING
    var sum = 0;
    activity.comments.forEach(element => {
      sum += boundten.boundbyten(parseInt(element.hypeRating));
      console.log("adding rating of " + element.hypeRating + " to get a sum of " + sum)
    });
    activity.hype = (sum / activity.comments.length);

    activity.save(function (err) {
      if (err) throw err
      res.redirect("/");

    })
  });
});


// -- DONE -- adds new comment to an activity by ID
app.post('/api/add/activity/:id/comment', function (req, res) {

  Activity.findOne({ _id: req.params.id }, function (err, activity) {
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

    //CALCULATE NEW RATING
    var sum = 0;
    activity.comments.forEach(element => {
      sum += boundten.boundbyten(parseInt(element.hypeRating));
      console.log("adding rating of " + element.hypeRating + " to get a sum of " + sum)
    });
    activity.hype = (sum / activity.comments.length);

    activity.save(function (err) {
      if (err) throw err
      return res.send("Comment added to the activity!")
    })
  });
});


// activates http listener
// http.listen(3000, function() {
//     console.log('Chat running');
// });

// connects chatroom socket
io.on('connection', function (socket) {
  console.log('NEW connection.');
  io.on('disconnect', function () {
    console.log('Oops. A user disconnected.');
  });
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });
});

// -- NOT DONE -- deletes activity by ID
app.delete('/api/activity/:id', function (req, res) {
  Activity.findByIdAndRemove(req.param.id, function (err, activity) {
    if (!activity) return res.send("Not Deleted")
    res.send("Deleted activity")
  });
});

// -- NOT DONE -- deletes group by ID
app.delete('/api/group/:id', function (req, res) {
  Group.findByIdAndRemove(req.param.id, function (err, group) {
    if (!group) return res.send("Not Deleted")
    res.send("Deleted group")
  });
});

// -- DONE --
let port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log(`Listening on port ${port}!`);
});
