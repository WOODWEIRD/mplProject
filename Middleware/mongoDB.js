const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

exports.connectToDatabase = async () => {
    try {
        await client.connect();
        db = client.db('blogDB');
        console.log('Connected to MongoDB');

    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err;
    }
};

exports.getDb = () => {
    if (!db) {
        throw new Error('err happened');
    }

    return db;
};

exports.closeDB = async () => {
    if (db) {
        client.close();
        console.log('Disconnected from MongoDB');
    } else {
        console.log('failed Disconnecting from MongoDB');
    }
}