var mongoose = require("mongoose");
var config = require("./config");

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.dbURL, config.mongo.options, function(err){
    if(err)
        console.log("ERR while connecting mongodb");
    console.log(`Connected to ${config.mongo.dbURL}`);
});

module.exports = mongoose;