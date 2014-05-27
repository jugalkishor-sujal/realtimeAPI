var MongoClient = require('mongodb').MongoClient;
exports.get = function (req, response) {
    try {
        //console.log("call get customerTypes");
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("CustomerTypes", function (err, collection) {
                  collection.find({}, {})
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

exports.add = function (request, response) {
    try {
        //console.log("call add customerTypes");
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("CustomerTypes")
                  .count({ id: { $exists: true } },
                  function (err, results) {
                      db.close();
                      if (err) {
                          console.log(err);
                      }
                      else {
                          var id = 0;
                          id = results + 1;
                          var name = request.body.name;
                          MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
                            function (err, db) {
                                db.collection('Categories')
                                    .insert(
                                    {
                                        id: id,
                                        name: name
                                    },
                                    function (err, result) {
                                        response.send(result);
                                        response.end();
                                        db.close();
                                        if (err) { console.log(err); }
                                    });
                            });
                      }
                  });
          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};

exports.update = function (request, response) {
    try {
        var id = request.body.id;
        var name = request.body.name;
        //console.log("call for update customerTypes");
        
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              db.collection('CustomerTypes')
                  .update(
                  { id: id },
                  { $set: { name: name } },
                  { multi: true },
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
exports.delete = function (request, response) {
    try {
        var id = request.body.id;

        //console.log("call for delete customerTypes");
       
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              db.collection('CustomerTypes')
                  .remove(
                  {
                      id: id
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