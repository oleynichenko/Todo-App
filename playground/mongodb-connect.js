const { baseUrl } = require(`../config`);

// const MongoClient = require(`mongodb`).MongoClient;
const {MongoClient, ObjectID} = require(`mongodb`);

MongoClient.connect(baseUrl, {useNewUrlParser: true }, (err, client) => {
   if (err) {
     return console.log(`Unable to connect to MongoDB server`);
   }

   const db = client.db(process.env.DB_NAME);

   db.collection(`todos`).insertOne({
     text: `Something to do`,
     completed: `false`
   }, (err, result) => {
     if (err) {
       return console.log(`Unable insert todo`, err.message);
     }
     console.log(JSON.stringify(result.ops, undefined, 2));
   });

   console.log(`Connected to MongoDB server`);

   client.close();
});
