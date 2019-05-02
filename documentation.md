
# ACTIVITIES HUB

---

Names: Matthew Graber, Eli Schrelling, Justin Shaw

Date: 5/2/2019

Project Topic: Activities Hub

URL: 

---


### 1. Data Format and Storage (NEEDS TO BE COMPLETED)



Schema: 
```javascript
{
   
}
```

### 2. Add New Data (NEEDS TO BE UPDATED)

HTML form route: `/add/activity`

POST endpoint route: `/api/add/activity`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/create',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       food: 'Chocolate Milk',
       reviewer_name: 'Tim',
       rating: 9,
       title: 'Phenomenal Cow Juice',
       content: 'Absolutely exquisite. Would drink again'

    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data (NEEDS TO BE UPDATED)

GET all endpoint route: `/api/food`
GET particular food by int ID endpoint route: `/api/id/:food_id`
GET best food endpoint route: `/api/best`
GET worst food endpoint route: `/api/worst`
GET most-reviewed food(s) endpoint route: `/api/most`
GET least-reviewed food(s) endpoint route: `/api/least`

### 4. Search Data (MIGHT NEED TO BE UPDATED)

Search Field: `name`

### 5. Navigation Pages (WILL NEED TO BE UPDATED)

Navigation Filters
1. Home -> `/`
2. Random Activity -> `/random`


