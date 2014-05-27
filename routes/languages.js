var MongoClient = require('mongodb').MongoClient;
exports.get = function (req, response) {
    try {
        console.log("call get languages");
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("languages", function (err, collection) {
 		if (err) {
                              console.log(err);
                              response.send({ Response: err });
                              response.end();
                              db.close();
                          } else {
                  collection.find({}, {})
                      .toArray(function (err, results) {
                           if (err) {
                              console.log(err);
                              response.send({ Response: err });
                              response.end();
                              db.close();
                          } else {
                          response.send(results);
                          response.end();
                          db.close();
                          }
                      });
}
              });

          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.end(); }
};
exports.add = function (request, response) {
    try {
        //console.log("call add categories");
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              //db.col.find().sort({ number: -1 }).limit(1)
              db.collection("languages")
                  .find({}, { LanguageID: 1, _id: 0 }).sort({ LanguageDescription: -1 }).limit(1).toArray(
                  function (err, results) {
                      if (err) {
                          console.log(err);
                      }
                      else {
                          console.log('outer');
                          console.log(results[0]);
                          if (results[0] !== undefined) {
                              results.forEach(function (reTemp) {
                                  console.log('inner');
                                  console.log(reTemp);
                                  var _LanguageID = 0;
                                  _LanguageID = reTemp.LanguageID + 1;
                                  var _LanguageDescription = request.body.LanguageDescription;
                                  db.collection('languages')
                                      .insert(
                                      {
                                          LanguageID: _LanguageID,
                                          LanguageDescription: _LanguageDescription
                                      },
                                      function (err, result) {
                                          response.send({ Response: result });
                                          response.end();
                                          db.close();
                                          if (err) { console.log(err); }
                                      });
                              });
                          }
                          else {
                              var _LanguageID = 1;
                              var _LanguageDescription = request.body.LanguageDescription;
                              db.collection('languages')
                                  .insert(
                                  {
                                      LanguageID: _LanguageID,
                                      LanguageDescription: _LanguageDescription
                                  },
                                  function (err, result) {
                                      response.send({ Response: result });
                                      response.end();
                                      db.close();
                                      if (err) { console.log(err); }
                                  });
                          }
                      }
                  });

          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.end(); }
};
exports.update = function (request, response) {
    try {
        var _LanguageID = request.body.LanguageID;
        var _LanguageDescription = request.body.LanguageDescription;
        //console.log("call for update Language " + _LanguageID);
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("languages", function (err, collection) {
                  collection.find({ LanguageID: _LanguageID }, { LanguageID: 1, LanguageDescription: 1, _id: 0 })
                      .toArray(function (err, results) {
                          //console.log(results);
                          if (results !== undefined) {
                              results.forEach(function (doc) {
                                  //var Contents = doc;
                                  //doc.ContentID = _LanguageID;
                                  doc.LanguageDescription = _LanguageDescription;
                                  collection.update({ "LanguageID": _LanguageID }, doc, { upsert: false }
                                          , function (err, objects) {
                                              //console.log(objects);
                                              response.send({ Response: objects });
                                              response.end();
                                              db.close();
                                              if (err) { console.log(err); }
                                          });
                              });
                          }
                      });
              });
          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.end(); }
};
exports.delete = function (request, response) {
    try {
        var _LanguageID = request.body.LanguageID;
        var resp = 0;
        // console.log("call for delete Language"+_LanguageID);

        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              db.collection('languages')
                  .remove(
                  {
                      LanguageID: parseInt(request.body.LanguageID, 10)
                  },
                  function (err, result) {
                      response.send({ Response: result });
                      response.end();
                      db.close();
                      if (err) { console.log(err); }
                  });

          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.end(); }
};