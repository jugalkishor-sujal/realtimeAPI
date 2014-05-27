var MongoClient = require('mongodb').MongoClient;
var pkgcloud = require('pkgcloud');
var path = require('path');
var fs = require('fs');
var clientTestingAccount = pkgcloud.storage.createClient({
    provider: 'rackspace',
    username: 'unicityitops',
    apiKey: 'c8629d25cd86f6d6aa6fed70ad1cc026',
});
var client = pkgcloud.storage.createClient({
    provider: 'rackspace',
    username: 'webservers',
    apiKey: '261d8d2b69eb0b37ea572b71a7e8097e',
});
exports.get = function (request, response) {
    try {
        var _CountryID = request.body.CountryID;
        var _LanguageID = request.body.LanguageID;
        var _CustomerTypeID = request.body.CustomerTypeID;

        console.log("call get cms_content" + _CountryID + _LanguageID + _CustomerTypeID);
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("cms_content", function (err, collection) {
                  collection.find({ ContentID: { $gt: 0, $lte: 4 }, CountryID: _CountryID, LanguageID: _LanguageID, CustomerTypeID: _CustomerTypeID }, {}).sort({ ContentID: 1 })
                      .toArray(function (err, results) {
                         // console.log(results);
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
              });

          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
function AddContent(called_from,_ContentID, _Contents, _PageContents, _CountryID, _LanguageID, _CustomerTypeID, request, response) {
    console.log('called_from' + called_from);
    MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
              function (err, db) {
                  var data = "";
                  db.collection("cms_content")
                      .count({ ContentID: { $exists: true } },
                      function (err, results) {
                          db.close();
                          if (err) {
                              console.log(err);
                          }
                          else {
                              if (called_from == 1) {
                                  _ContentID = results + 1;
                              }
                              MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
                                 function (err, db) {
                                     db.collection('cms_content')
                                         .insert(
                                         {
                                             ContentID: _ContentID,
                                             Contents: _Contents,
                                             PageContents: _PageContents,
                                             CountryID: _CountryID,
                                             LanguageID: _LanguageID,
                                             CustomerTypeID: _CustomerTypeID
                                         },
                                         function (err, result) {
                                             if (err) {
                                                 console.log(err); response.send({ Response: err });
                                                 response.end();
                                                 db.close();
                                             } else {
                                                 if (parseInt(request.body.Operation, 10) === 1) {
                                                     console.log("BEFORE READ FILE FROM NODE TO SEND ON RACK cms");
                                                     var myFile = fs.createReadStream("uploads/" + _Contents);// request.files.file;//fs.createReadStream('d:\\test.txt');

                                                     myFile.pipe(client.upload({
                                                         container: 'myResource',
                                                         remote: _Contents
                                                     }, function (err, results) {
                                                         if (results) {
                                                             console.log("UPLOAD TO RACK cms");
                                                             //fs.unlink("uploads/" + _Contents, function (err, result) {
                                                             //if (result) {
                                                             response.send({ Response: results });
                                                             //}
                                                             //    if (err) { response.send({ Response: err }); console.log(err); }
                                                             //});

                                                         }
                                                         else {
                                                             console.log("ERROR UPLOAD TO RACK cms");
                                                             console.log(err);
                                                             response.send({ Response: err });
                                                         }
                                                         response.end();
                                                         db.close();
                                                     }));
                                                 }
                                             }
                                         });
                                 });
                          }
                      });
              });
};
function UpdateContent(_ContentID, _Contents, _PageContents, _CountryID, _LanguageID, _CustomerTypeID, request, response) {
    MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
              function (err, db) {
                  var data = "";
                  db.collection("cms_content", function (err, collection) {
                      collection.find({ ContentID: _ContentID, CountryID: _CountryID, LanguageID: _LanguageID, CustomerTypeID: _CustomerTypeID }, {})
                          .toArray(function (err, results) {
                              //console.log( results);
                              if (results.length > 0) {
                                  console.log('update start' + results[0]);
                                  results.forEach(function (Contents) {
                                      console.log('fetched content' + _Contents);
                                      //Contents.ContentID = _ContentID;
                                      //Contents.LanguageID = _LanguageID;
                                      //Contents.CountryID = _CountryID;
                                     // Contents.CustomerTypeID = _CustomerTypeID;
                                      if (_Contents === '' || _Contents === undefined) {
                                          Contents.Contents = Contents.Contents;
                                      } else {
                                          Contents.Contents = _Contents;
                                          //jo
                                      }
                                      console.log('update data' + Contents.Contents + "to" + _Contents);
                                      Contents.PageContents = _PageContents;
                                      collection.update({ ContentID: _ContentID, CountryID: _CountryID, LanguageID: _LanguageID, CustomerTypeID: _CustomerTypeID }, Contents, { upsert: true }
                                              , function (err, objects) {
                                                  if (err) {
                                                      console.log(err);
                                                      response.send({ Response: err });
                                                      response.end();
                                                      db.close();
                                                  } else {
                                                      //update new file
                                                      if (parseInt(request.body.Operation, 10) === 1) {
                                                          console.log("BEFORE READ FILE FROM NODE TO SEND ON RACK cms");
                                                          var myFile = fs.createReadStream("uploads/" + _Contents);// request.files.file;//fs.createReadStream('d:\\test.txt');

                                                          myFile.pipe(client.upload({
                                                              container: 'myResource',
                                                              remote: _Contents
                                                          }, function (err, results) {
                                                              if (results) {
                                                                  console.log("UPLOAD TO RACK cms");
                                                                  //fs.unlink("uploads/" + _Contents, function (err, result) {
                                                                  //    if (result) {
                                                                  response.send({ Response: results });
                                                                  response.end();
                                                                  db.close();
                                                                  //}
                                                                  //if (err) { response.send({ Response: err }); console.log(err); }
                                                                  // });

                                                              }
                                                              else {
                                                                  console.log("ERROR UPLOAD TO RACK cms");
                                                                  console.log(err);
                                                                  response.send({ Response: err });
                                                                  response.end();
                                                                  db.close();
                                                              }
                                                              
                                                          }));
                                                      } else {
                                                          response.send({ Response: objects });
                                                          response.end();
                                                          db.close();
                                                      }
                                                  }
                                              });
                                  });
                              } else {
                                  console.log('Record not found So add start from update');
                                  AddContent(2, _ContentID, _Contents, _PageContents, _CountryID, _LanguageID, _CustomerTypeID, request, response);
                              }
                          });
                  });
              });
};
exports.add = function (request, response) {
    try {
        var JsonData = request.body.JsonData;
        var _ContentID = parseInt(JsonData.ContentID, 10);
        var _CountryID = JsonData.CountryID;
        var _LanguageID = JsonData.LanguageID;
        var _CustomerTypeID = parseInt(JsonData.CustomerTypeID, 10);
        var _PageContents = JsonData.PageContents;
        var _Contents = '';
        var req_remote_path = '';
        if (parseInt(request.body.Operation, 10) === 1) {
            req_remote_path = request.files.file.path;
            var remote_file_name = path.basename(req_remote_path);
            _Contents = remote_file_name;
        }
        console.log("Operation :" + request.body.Operation);
        console.log('insert add start ');
        AddContent(1,_ContentID, _Contents, _PageContents, _CountryID, _LanguageID, _CustomerTypeID, request, response);
        
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
exports.update = function (request, response) {
    try {
        console.log(request.body);
        var JsonData = {};
        var _Contents = '';
        var req_remote_path = '';
        if (parseInt(request.body.Operation, 10) === 1) {
            req_remote_path = request.files.file.path;
            console.log(req_remote_path);
            var remote_file_name = path.basename(req_remote_path);
            _Contents = remote_file_name;
            JsonData = JSON.parse(request.body.JsonData);
        } else {
            JsonData = request.body.JsonData;
        }

        var _ContentID = parseInt(JsonData.ContentID, 10);
        var _CountryID = JsonData.CountryID;
        var _LanguageID = JsonData.LanguageID;
        var _CustomerTypeID = parseInt(JsonData.CustomerTypeID, 10);
        var _PageContents = JsonData.PageContents;
        
        console.log("Operation :" + request.body.Operation);
        //console.log(_ContentID + _Contents + _PageContents + _CountryID + _LanguageID + _CustomerTypeID);
        UpdateContent(_ContentID, _Contents, _PageContents, _CountryID, _LanguageID, _CustomerTypeID, request, response);
    }
    catch (ex)
    { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
exports.delete = function (request, response) {
    try {
        var _ContentID = request.body.ContentID;
        var _CountryID = request.body.CountryID;
        var _LanguageID = request.body.LanguageID;
        var _CustomerTypeID = request.body.CustomerTypeID;
        //console.log("call for delete cms_content");

        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
         function (err, db) {
             var fileOnRack = "";
             db.collection("cms_contents", function (err, collection) {
                 collection.find({ ContentID: _ContentID, CountryID: _CountryID, LanguageID: _LanguageID, CustomerTypeID: _CustomerTypeID }, {})
                     .toArray(function (err, results) {
                         if (results !== undefined) {
                             results.forEach(function (doc) {
                                 fileOnRack = doc.Contents;
                                 client.removeFile("myResource", fileOnRack, function (err, result) {
                                     fs.unlink("uploads/"+fileOnRack, function (err, result) {
                                         if (result) {
                                             collection('cms_contents').remove({ ContentID: _ContentID, CountryID: _CountryID, LanguageID: _LanguageID, CustomerTypeID: _CustomerTypeID },
                                         function (err, result) {
                                             response.send({ Response: result });
                                             response.end();
                                             db.close();
                                             if (err) { console.log(err); }
                                         });
                                         }
                                         if (err) { response.send({ Response: err }); console.log(err); }
                                     });
                                    

                                 });

                             });
                         }
                     });
             });
         });
          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
exports.updateRecordsCMS = function (request, response) {
    try {
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              if (err) {
                  console.log(err);
                  response.send({ Response: err });
                  response.end();
                  db.close();
              } else {
                  db.collection("cms_content", function (err, collection) {
                      if (err) {
                          console.log(err);
                          response.send({ Response: err });
                          response.end();
                          db.close();
                      } else {
                          collection.find()
                              .toArray(function (err, results) {
                                  if (err) {
                                      console.log(err);
                                      response.send({ Response: err });
                                      response.end();
                                      db.close();
                                  } else {
                                      if (results.length > 0) {
                                          var _id = 0;
                                          results.forEach(function (doc) {
                                              if (doc !== undefined) {
                                                  var i = 0;
                                                  _id = doc._id;
                                                  
                                                  if (doc.CountryID !== undefined){
                                                      if (doc.CountryID !== 'undefined'){
                                                          if (doc.CountryID !== null) {

                                                              console.log("Before: " + doc.CountryID);
                                                              if (doc.CountryID === 1) { doc.CountryID = "CA"; }
                                                              if (doc.CountryID === 2) { doc.CountryID = "US"; }                                                             
                                                              console.log("After: " + doc.CountryID);

                                                          } else { console.log(doc._id + 'wrong null'); doc.CountryID = "CA"; }
                                                      } else { console.log(doc._id + 'wrong qout undefined'); doc.CountryID = "CA"; }
                                                  } else { console.log(doc._id + 'wrong undefined'); doc.CountryID = "CA"; }

                                                  if (doc.LanguageID !== undefined) {
                                                      if (doc.LanguageID !== 'undefined') {
                                                          if (doc.LanguageID !== null) {

                                                  console.log("Before: " + doc.LanguageID);
                                                  if (doc.LanguageID === 0) { doc.LanguageID = "EN"; }
                                                  if (doc.LanguageID === 311) { doc.LanguageID = "FR"; }
                                                  if (doc.LanguageID === 373) { doc.LanguageID = "ES"; }
                                                  console.log("After: " + doc.LanguageID);

                                                          } else { console.log(doc._id + 'wrong null'); doc.LanguageID = "EN"; }
                                                      } else { console.log(doc._id + 'wrong qout undefined'); doc.LanguageID = "EN"; }
                                                  } else { console.log(doc._id + 'wrong undefined'); doc.LanguageID = "EN"; }
                                                                                                   
                                                  collection.update({"_id":_id}, doc, { upsert: false }
                                                      , function (err, objects) {
                                                          if (err) {
                                                              console.log(err);
                                                          } else {
                                                              data = data + objects;
                                                              console.log(objects);
                                                          }
                                                      });
                                              }


                                          });
                                          response.send({ Response: data });                                         
                                      } else {
                                          response.send({ Response: 'Record not found to perform update operation!!' });
                                          response.end();
                                          db.close();
                                      }
                                  }
                              });
                      }
                  });

              }
          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};