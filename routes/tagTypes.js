var MongoClient = require('mongodb').MongoClient;
exports.get = function (req, response) {
    try {
        //console.log("call get TagTypes");
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("TagTypes", function (err, collection) {
                  collection.find({}, { TagTypeID: 1, TagTypeDescription: 1, _id: 0 })
                      .toArray(function (err, results) {
                          //console.log(results);
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
        var _TagTypeID = request.body.TagTypeID;
        var _TagTypeDescription = request.body.TagTypeDescription;
        //console.log("call for add TagType");

        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              db.collection('TagTypes')
                  .insert(
                  {
                      TagTypeID: _TagTypeID,
                      TagTypeDescription: _TagTypeDescription
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

exports.update = function (request, response) {
    try {
        var _TagTypeID = request.body.TagTypeID;
        var _TagTypeDescription = request.body.TagTypeDescription;
        //console.log("call for update TagType");

        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              db.collection('TagTypes')
                  .update(
                  { TagTypeID: _TagTypeID },
                  { $set: { TagTypeDescription: _TagTypeDescription } },
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
        var _TagTypeID = request.body.TagTypeID;

        //console.log("call for delete TagType");

        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              db.collection('TagTypes')
                  .remove(
                  {
                      TagTypeID: _TagTypeID
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