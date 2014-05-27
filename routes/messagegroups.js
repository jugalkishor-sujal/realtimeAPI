var MongoClient = require('mongodb').MongoClient;
var connectionString = 'mongodb://127.0.0.1:27017/MessageApplication';


exports.get = function (req, response) {
    try {
        console.log("call get MessageGroups");
        MongoClient.connect(connectionString,
          function (err, db) {
              var data = "";
              db.collection("MessageGroups", function (err, collection) {
                  collection.find().toArray(function (err, results) {
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

///  add events  {"GroupID":2,"GroupName":"GroupTwo","GroupCustomerID":96342802,"GroupRecepients":["11533149","11533249"]}
// {"GroupID":2,"GroupName":"GroupTwo","GroupCustomerID":96342802,"GroupRecepients":["11533149","11533249"]}
exports.add = function (request, response) {
    try {
        console.log("call add MessageGroups");
        var JsonData = request.body;
        MongoClient.connect(connectionString,
      function (err, db) {
          db.collection("MessageGroups")
                   .find({}, { GroupID: 1, _id: 0 }).sort({ GroupID: -1 }).limit(1).toArray(
                   function (err, results) {
                       if (err) {
                           console.log(err);
                       }
                       else {
                           if (results[0] !== undefined) {
                               results.forEach(function (reTemp) {
                                   JsonData.GroupID = reTemp.GroupID + 1;
                                   db.collection('MessageGroups').insert(JsonData, function (err, result) {
                                       response.send({ Response: result });
                                       response.end();
                                       db.close();
                                       if (err) { console.log(err); }
                                   });
                               });
                           } else {
                               JsonData.GroupID =  1;
                               db.collection('MessageGroups').insert(JsonData, function (err, result) {
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
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
///  add events  {"GroupID":1, "GroupName":"GroupOne","GroupCustomerID": 96342802, "GroupRecepients":["nattapong.juengpicharnwanit@unicity.net","lynette.bolton@unicity.net"]}
exports.update = function (request, response) {
    try {
        console.log("call update MessageGroups");
        var _GroupID = request.body.GroupID;
        var _GroupName = request.body.GroupName;
        var _GroupCustomerID = request.body.GroupCustomerID;
        var _GroupRecepients = request.body.GroupRecepients;

        MongoClient.connect(connectionString,
          function (err, db) {
              var data = "";
              db.collection("MessageGroups", function (err, collection) {
                  collection.find({ GroupID: _GroupID }, {})
                      .toArray(function (err, results) {
                          if (results !== undefined) {
                              results.forEach(function (doc) {
                                  doc.GroupName = _GroupName;
                                  doc.GroupCustomerID = _GroupCustomerID;
                                  doc.GroupRecepients = _GroupRecepients;
                                  collection.update({ "GroupID": _GroupID }, doc, { upsert: false }
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
        var _GroupID = request.body.GroupID;
        console.log("call delete MessageGroups");
        MongoClient.connect(connectionString,
          function (err, db) {
              db.collection('MessageGroups').remove(
                  {
                      GroupID: _GroupID
                  },
                  function (err, result) {
                      response.send({ Response: result });
                      response.end();
                      db.close();
                      if (err) { console.log(err); }
                  });
          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
