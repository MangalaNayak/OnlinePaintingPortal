require('dotenv').config()
var defaults = {
    port: process.env.PORT,
    mongo: {
        dbURL: 'mongodb://localhost:27017/OnlinePaintingPortal',
        options: {
            'useCreateIndex': true,
            'useFindAndModify': false,
            'useNewUrlParser': true
        }
    }
}
module.exports = defaults;