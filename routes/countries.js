var MongoClient = require('mongodb').MongoClient;
exports.get = function (req, response) {
    try {
        console.log("call get countries");
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("countries", function (err, collection) {
                  collection.find({}, {})
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
    catch (ex) { console.log("\n Exception #" + ex); response.end(); }
};
exports.add = function (request, response) {
    try {
        //console.log("call add categories");
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              //db.col.find().sort({ number: -1 }).limit(1)
              db.collection("countries")
                  .find({}, { CountryID: 1, _id: 0 }).sort({ CountryDescription: -1 }).limit(1).toArray(
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
                                  var _CountryID = 0;
                                  _CountryID = reTemp.CountryID + 1;
                                  var _CountryDescription = request.body.CountryDescription;
                                  db.collection('countries')
                                      .insert(
                                      {
                                          CountryID: _CountryID,
                                          CountryDescription: _CountryDescription
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
                              var _CountryID = 1;
                              var _CountryDescription = request.body.CountryDescription;
                              db.collection('countries')
                                  .insert(
                                  {
                                      CountryID: _CountryID,
                                      CountryDescription: _CountryDescription
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
        var _CountryID = request.body.CountryID;
        var _CountryDescription = request.body.CountryDescription;
        //console.log("call for update Country " + _CountryID);
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("countries", function (err, collection) {
                  collection.find({ CountryID: _CountryID }, { CountryID: 1, CountryDescription: 1, _id: 0 })
                      .toArray(function (err, results) {
                          //console.log(results);
                          if (results !== undefined) {
                              results.forEach(function (doc) {
                                  //var Contents = doc;
                                  //doc.ContentID = _CountryID;
                                  doc.CountryDescription = _CountryDescription;
                                  collection.update({ "CountryID": _CountryID }, doc, { upsert: false }
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
        var _CountryID = request.body.CountryID;
        var resp = 0;
        // console.log("call for delete Country"+_CountryID);

        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              db.collection('countries')
                  .remove(
                  {
                      CountryID: parseInt(request.body.CountryID, 10)
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
