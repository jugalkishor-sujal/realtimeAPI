var MongoClient = require('mongodb').MongoClient;
var connectionString = 'mongodb://127.0.0.1:27017/activity';


exports.get = function (req, response) {
    try {
        console.log("call get Activity");
        var _CustomerID = req.body.CustomerID;
        MongoClient.connect(connectionString,
          function (err, db) {
              var data = "";
              db.collection("activity", function (err, collection) {
                  collection.find({ "CustomerID": _CustomerID }).toArray(function (err, results) {
                      
                      if (err) {
                          console.log(err);
                          response.send(err);
                          response.end();
                      } else {
                          response.send(results);
                          response.end();
                      }
                      db.close();
                  });
              });

          });
    }
    catch (ex) {
        console.log("\n Exception #" + ex);
        response.send({ Response: ex });
        response.end();
        //db.close();
    }
};


exports.add = function (request, response) {
    try {
        console.log("call add Activity");
        var _CustomerID = request.body.CustomerID;
        var _CustomerLeadID = request.body.CustomerLeadID;
        var _LastActivity = request.body.LastActivity;
        var _LevelOfInterest = request.body.LevelOfInterest;
        var _NextActivity = request.body.NextActivity;
        var _Notes = request.body.Notes;
        var JsonData = request.body;
        MongoClient.connect(connectionString,
      function (err, db) {
          db.collection("activity").insert(JsonData, function (err, result) {
                                   response.send({ Response: result });
                                   response.end();
                                   db.close();
                                   if (err) { console.log(err); }
                   });
      });
    }
    catch (ex) {
        console.log("\n Exception #" + ex);
        response.send({ Response: ex });
        response.end();
        //db.close();
    }
};

exports.update = function (request, response) {
    try {
        console.log("call update Activity");
        var _CustomerID = request.body.CustomerID;
        var _CustomerLeadID = request.body.CustomerLeadID;
        var _LastActivity = request.body.LastActivity;
        var _LevelOfInterest = request.body.LevelOfInterest;
        var _NextActivity = request.body.NextActivity;
        var _Notes = request.body.Notes;
        var JsonData = request.body;
        MongoClient.connect(connectionString,
          function (err, db) {
              var data = "";
              db.collection("activity", function (err, collection) {
                  collection.find({ "CustomerID": _CustomerID, "CustomerLeadID": _CustomerLeadID }, {})
                      .toArray(function (err, results) {                          
                          if (err) {
                              console.log(err);
                              response.send({ Response: err });
                              response.end();
                          } else {
                              if (results.length > 0)
                              {
                                  console.log("results !== undefined");
                                  console.log(results);
                                  results.forEach(function (doc) {
                                      doc.CustomerID = _CustomerID;
                                      doc.CustomerLeadID = _CustomerLeadID;
                                      doc.LastActivity = _LastActivity;
                                      doc.LevelOfInterest = _LevelOfInterest;
                                      doc.NextActivity = _NextActivity;
                                      doc.Notes = _Notes;
                                      collection.update({ "CustomerID": _CustomerID, "CustomerLeadID": _CustomerLeadID }, doc, { upsert: false }
                                              , function (err, objects) {
                                                  //console.log(objects);                                                                                            
                                                  if (err) {
                                                      console.log(err);
                                                      response.send({ Response: err });
                                                      response.end();
                                                  } else {
                                                      response.send({ Response: objects });
                                                      response.end();
                                                  }
                                                  db.close();
                                              });

                                  });
                              }
                              else {
                                  console.log("results === undefined");
                                  db.collection("activity").insert(JsonData, function (err, result) {
                                      if (err) {
                                          console.log(err);
                                          response.send({ Response: err });
                                          response.end();
                                      } else {
                                          response.send({ Response: result });
                                          response.end();
                                      }
                                      db.close();
                                  });

                              }
                          }

                      });
              });
          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
exports.updateLastActivity = function (request, response) {
    try {
        console.log("call update Activity");
        var _CustomerID = request.body.CustomerID;
        var _CustomerLeadID = request.body.CustomerLeadID;
        var _LastActivity = request.body.LastActivity;
        
        var JsonData = request.body;
        MongoClient.connect(connectionString,
          function (err, db) {
              var data = "";
              db.collection("activity", function (err, collection) {
                  collection.find({ "CustomerID": _CustomerID, "CustomerLeadID": { $in: _CustomerLeadID } }, {})         

                      .toArray(function (err, results) {
                          if (err) {
                              console.log(err);
                              response.send({ Response: err });
                              response.end();
                          } else {

                              if (results.length > 0) {
                                  console.log("results !== undefined");
                                  console.log(results);
                                  results.forEach(function (doc) {

                                      doc.CustomerID = _CustomerID;
                                      doc.CustomerLeadID = doc.CustomerLeadID;
                                      doc.LastActivity = _LastActivity;
                                      doc.LevelOfInterest = doc.LevelOfInterest;
                                      doc.NextActivity = doc.NextActivity;
                                      doc.Notes = doc.Notes;
                                      collection.update({ "CustomerID": _CustomerID, "CustomerLeadID": doc.CustomerLeadID }, doc, { upsert: false }
                                              , function (err, objects) {
                                                  //console.log(objects);                                                                                            
                                                  if (err) {
                                                      console.log(err);
                                                      response.send({ Response: err });
                                                      response.end();
                                                  } else {
                                                      response.send({ Response: objects });
                                                      response.end();
                                                  }
                                          
                                              });

                                  });        db.close();
                              }
                              else {
                                  console.log("results === undefined");
                                  db.collection("activity").insert(JsonData, function (err, result) {
                                      if (err) {
                                          console.log(err);
                                          response.send({ Response: err });
                                          response.end();
                                      } else {
                                          response.send({ Response: result });
                                          response.end();
                                      }
                                      db.close();
                                  });

                              }
                          }
                      });
              });
          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
exports.delete = function (request, response) {
    try {
        var _CustomerID = request.body.CustomerID;
        var _CustomerLeadID = request.body.CustomerLeadID;
        console.log("call delete activity");
        MongoClient.connect(connectionString,
          function (err, db) {
              db.collection('activity').remove(
                  { "CustomerID": _CustomerID, "CustomerLeadID": _CustomerLeadID },
                  function (err, result) {
                      if (err) {
                          console.log(err);
                          response.send({ Response: err });
                          response.end();
                      } else {
                          response.send({ Response: objects });
                          response.end();
                      }
                      db.close();
                  });
          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
