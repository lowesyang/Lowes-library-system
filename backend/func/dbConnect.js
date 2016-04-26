var client=require("mysql").createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'root'
});
var DB_NAME='library_system';
client.connect();
client.query('USE '+DB_NAME);

exports.client=client;