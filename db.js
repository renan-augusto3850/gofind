const MongoClient = require('mongodb').MongoClient;

module.exports = async () => {

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const db = client.db('siteCatalog');
    return db;
}