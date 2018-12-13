const { baseUrl } = require(`../config`);

const {MongoClient} = require(`mongodb`);

MongoClient.connect(baseUrl, {useNewUrlParser: true }, (err, client) => {
   if (err) {
     return console.log(`Unable to connect to MongoDB server`);
   }

   const db = client.db(process.env.DB_NAME);

   db.collection(`todos`).find()
     .toArray()
     .then((result) => {
       console.log(result);
     }, (err) => {
       console.log(`Unable to fetch`, err.message);
     });

   client.close();
});
