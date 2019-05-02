// I think this is irrelevant because we're using a database but I'll leave it here for now just in case

var fs = require('fs');

function loadData() {
    return JSON.parse(fs.readFileSync('data.json'));
}

function saveData(data) {
    // poke.json stores the pokemon array under key "pokemon", 
    // so we are recreating the same structure with this object
    var obj = {
        food_reviews: data
    };

    fs.writeFileSync('data.json', JSON.stringify(obj));
}

function getAllFood(data) {
    var allFood = [];
    for(var i = 0; i < data.length; i++) {
        var food = data[i].food;
        
        if(!~allFood.indexOf(food)) allFood.push(food);
        
    }
    return allFood;
}

module.exports = {
    loadData: loadData,
    saveData: saveData,
    getAllFood: getAllFood
}
