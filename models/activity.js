var mongoose = require('mongoose');

// This is the schema for the comments on each activity
var commentSchema = new mongoose.Schema({

    hypeRating: {
        type: Number,
        min: 0.0,
        max: 10.0,
        required: true
    },
    comment: {
        type: String
    },
    author: {
        type: String,
        required: true
    }
});


// This is the schema for each activity
var activitySchema = new mongoose.Schema({
   
    name: {
        type: String,
       // required: true
    },
    hype: {
        type: Number,
    },
    description: {
        type: String
    },
    where: {
        type: String
    },
    when: {
        type: String
    },
    author: {
        type: String,
    //    required: true
    },
    comments: [commentSchema]
});

// This is the schema for each group (I was thinking like groups that might hold activities,
// like clubs or frats or whatever, we can change this if someone thinks of something better,
// we just need to have at least 3 schema). Also not sure if this belongs in this file or not.
var groupSchema = new mongoose.Schema({
  
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    memberCount: {
        type: Number,
  //      required: true
    },
    location: {
        type: String,
        required: true
    },
    contactInfo: {
        type: String,
     //   required: true
    },
    
});

var comment = mongoose.model('Comment', commentSchema);
var activity = mongoose.model('Activity', activitySchema);
var group = mongoose.model('Group', groupSchema);

module.exports = { comment, activity, group };
