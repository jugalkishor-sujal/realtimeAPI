var MongoClient = require('mongodb').MongoClient;
exports.get = function (req, response) {
    try {
        console.log("call get categories");
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("Categories", function (err, collection) {
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
              db.collection("Categories")
                  .find({}, { CategoryID: 1, _id: 0 }).sort({ CategoryID: -1 }).limit(1).toArray(
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
                                  var _CategoryID = 0;
                                  _CategoryID = reTemp.CategoryID + 1;
                                  var _CategoryDescription = request.body.CategoryDescription;
                                  db.collection('Categories')
                                      .insert(
                                      {
                                          CategoryID: _CategoryID,
                                          CategoryDescription: _CategoryDescription
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
                              var _CategoryID = 1;
                              var _CategoryDescription = request.body.CategoryDescription;
                              db.collection('Categories')
                                  .insert(
                                  {
                                      CategoryID: _CategoryID,
                                      CategoryDescription: _CategoryDescription
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
        var _CategoryID = request.body.CategoryID;
        var _CategoryDescription = request.body.CategoryDescription;
        //console.log("call for update Category " + _CategoryID);
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("Categories", function (err, collection) {
                  collection.find({ CategoryID: _CategoryID }, { CategoryID: 1, CategoryDescription: 1, _id: 0 })
                      .toArray(function (err, results) {
                          //console.log(results);
                          if (results !== undefined) {
                              results.forEach(function (doc) {
                                  //var Contents = doc;
                                  //doc.ContentID = _CategoryID;
                                  doc.CategoryDescription = _CategoryDescription;
                                  collection.update({ "CategoryID": _CategoryID }, doc, { upsert: false }
                                          , function (err, objects) {
                                              console.log(objects);
                                              db.collection("Resources", function (err, collection) {
                                                  collection.find({ CategoryID: _CategoryID }, {})
                                                      .toArray(function (err, results) {
                                                          console.log(results);
                                                          if (results[0] !== undefined ) {
                                                              results.forEach(function (doc) {
                                                                  doc.CategoryDescription = _CategoryDescription;

                                                                  collection.update({ "resourceID": doc.resourceID }, doc, { upsert: false }
                                                                          , function (err, objects) {
                                                                              //console.log(objects);
                                                                              response.send({ Response: objects });
                                                                              response.end();
                                                                              db.close();
                                                                              if (err) { console.log(err); }
                                                                          });
                                                              });
                                                          } else {
                                                              console.log("\n error in find result" + err);
                                                              response.send({ Response: err });
                                                              response.end();
                                                              db.close();
                                                          }
                                                      });
                                              });

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
        var _CategoryID = request.body.CategoryID;
        var resp = 0;
        // console.log("call for delete Category"+_CategoryID);

        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              db.collection('Categories')
                  .remove(
                  {
                      CategoryID: parseInt(request.body.CategoryID, 10)
                  },
                  function (err, result) {
                      if (err) {
                          resp = 0;
                      }
                      else {
                          db.collection('Resources').remove(
                                  { CategoryID: parseInt(request.body.CategoryID, 10) },
                                 function (err, result) {
                                     //console.log(result);
                                     response.send({ Response: result });
                                     response.end();
                                     db.close();
                                     if (err) { console.log(err); }

                                 });
                      }
                  });

          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.end(); }
};