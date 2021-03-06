Activities hub website created for CMSC389K.

# ACTIVITIES HUB

---

Names: Matthew Graber, Eli Schwelling, Justin Shaw

Date: 5/2/2019

Project Topic: Activities Hub

URL: https://activities-hub.herokuapp.com/

---


### 1. Data Format and Storage


activitySchema: 
```javascript
{
   name: String,
    hype: Number,
    description: String,
    where: String,
    when: String,
    author: String
    comments: [commentSchema]
}
```

commentSchema: 
```javascript
{
  hypeRating: Number,
    comment: String,
    author: String,
}
```

groupSchema: 
```javascript
{
  name: String,
    description: String,
    memberCount: Number,
    location: String,
    contactInfo: String
}
```

### 2. Add New Data

HTML form route: `/add/activity`

POST endpoint route: `/api/add/activity`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/add/activity',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       name: 'Paint Night',
       description: 'Come paint a picture!',
       where: 'McKeldin',
       when: 'December 20, 2020'
       author: 'Krista'
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

HTML form route: `/`

POST endpoint route: `/api/add/activity/:id/comment`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/add/activity/:id/comment',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       hypeRating: 5,
       comment: 'I do not want to paint.',
       author: 'Chris'
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```


HTML form route: `/add/group`

POST endpoint route: `/api/add/group`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/add/group',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       name: 'Dance Team',
       description: 'We do the dance so you do not need to.',
       memberCount: 17,
       location: 'Hornbake',
       contact: 'danceteamumd@dancebois.com',
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET all activities endpoint route: `/`
GET all activities API endpoint route: `/api/activity`
GET random activity endpoint route: `/random`
GET about page endpoint route: `/about`
GET most-commented activtiy endpoint route: `/most`
GET least-commented activity endpoint route: `/least`
GET most-hyped activity endpoint route: `/best`
GET most-hyped activity API endpoint route: `/api/best`
GET least-hyped activity endpoint route: `/worst`
GET least-hyped activity endpoint route: `/api/worst`
GET add activity page endpoint route: `/add/activity`
GET add group page endpoint route: `/add/group`
GET add group error page endpoint route: `/add/group/error`
GET chat page endpoint route: `/chat`
GET view groups endpoint route: `/groups`
GET view groups API endpoint route: `/api/groups`

### 4. Search Data

Search Field: `name` (of activity)

### 5. Navigation Pages

Navigation Filters
1. Home -> `/`
2. Random Activity -> `/random`
3. Most Commented -> `/most`
4. Least Commented -> `/least`
5. Most Hype -> `/best`
6. Least Hype -> `/worst`
7. View Groups -> `/groups`

### 6. Modules

activity.js exports the three schemas for use in index.js
boundbyten.js exports a function that ensures all hype values are between 0 and 10


### 7. New NPM Packages
1. roundto.js: Used for rounding hype ratings
2. validator.js: Ensures that group contact info is in the correct format
