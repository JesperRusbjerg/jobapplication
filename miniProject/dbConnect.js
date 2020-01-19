var mongoose = require('mongoose');
let debug = require("debug")("jp-dbConnect")

mongoose.connection.on('connected', function () {
    debug('Mongoose default connection open ');
});
mongoose.connection.on('disconnected', function () {
    debug('Mongoose connection closed ');
});
mongoose.connection.on('error', function (err) {
    debug('Mongoose default connection error: ' + err);
});

async function disconnect(){
    return await mongoose.disconnect()
}

function connect(connectionString=require("./settings").TEST_DB_URI) {
  return mongoose.connect(connectionString, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
}

module.exports = {connect, disconnect};