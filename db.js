const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect("mongodb://localhost:27017/youtube-clone")
      .then((client) => {
        console.log("mongoooooooo");
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        // console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
