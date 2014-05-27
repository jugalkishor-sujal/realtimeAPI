var MongoClient = require('mongodb').MongoClient;
exports.get = function (req, response) {
    try {
        //console.log("call get Tags");
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("Tags", function (err, collection) {
                  collection.find({}, {_id: 0 })
                      .toArray(function (err, results) {                          
                          response.send(results);
                          response.end();
                          db.close();
                          if (err) { console.log(err); }
                      });
              });

          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
exports.delete = function (request, response) {
    try {
        var _TagID = request.body.TagID;

        //console.log("call for delete Tag");

        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              db.collection('Tags')
                  .remove(
                  {
                      TagID: _TagID
                  },
                  function (err, result) {
                      response.send(result);
                      response.end();
                      db.close();
                      if (err) { console.log(err); }
                  });
          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
