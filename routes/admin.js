var MongoClient = require('mongodb').MongoClient;
exports.get = function (request, response) {
    try {
        var _UserName = request.body.UserName;
        //console.log(_UserName);
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("Admins", function (err, collection) {
                  collection.find({ UserName: _UserName }, { ModulesID: 1, _id: 0 })
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
        //console.log("call add admins");
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("Admins")
                  .count({ UserID: { $exists: true } },
                  function (err, results) {
                      db.close();
                      if (err) {
                          console.log(err);
                      }
                      else {
                          var _UserID = 0;
                          _UserID = results + 1;
                          var _UserName = request.body.UserName;
                          var _CustomerID = request.body.CustomerID;
                          var _ModulesID = request.body.ModulesID;
                          //console.log(request.body);
                          MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
                            function (err, db) {
                                db.collection('Admins')
                                    .insert(
                                    {
                                        UserID: _UserID, UserName: _UserName, CustomerID: _CustomerID, ModulesID: _ModulesID

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
        //var _UserID = request.body.UserID;
        //var _UserName = request.body.UserName;
        //var _CustomerID = request.body.CustomerID;
        //var _ModulesID = request.body.ModulesID;
       
        //MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
        //   function (err, db) {
        //       var data = "";
        //       db.collection("admins", function (err, collection) {
        //           collection.find({ UserID: _UserID }, { UserID: 1, Contents: 1, _id: 0 })
        //               .toArray(function (err, results) {
        //                   results.forEach(function (doc) {
        //                       var Contents = doc;
        //                       Contents.UserID = _UserID;
        //                       Contents.Contents = _Contents;
        //                       collection.update({ "UserID": Contents.UserID }, Contents, { upsert: false }
        //                               , function (err, objects) {
        //                                   console.log(objects);
        //                                   response.send({ Response: objects });
        //                                   response.end();
        //                                   db.close();
        //                                   if (err) { console.log(err); }
        //                               });
        //                   });

        //               });
        //       });
        //   });
    }
    catch (ex)
    { console.log("\n Exception #" + ex); response.end(); }
};
exports.delete = function (request, response) {
    try {
        var _UserID = request.body.UserID;

        //console.log("call for delete admins");

        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              db.collection('admins')
                  .remove(
                  {
                      UserID: _UserID
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