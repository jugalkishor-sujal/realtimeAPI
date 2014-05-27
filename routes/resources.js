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
exports.get = function (req, response) {
    try {
        var _CategoryID = req.body.CategoryID;
        var _CountryID = req.body.CountryID;
        var _LanguageID = req.body.LanguageID;
        var _CustomerTypeID = req.body.CustomerTypeID;
        var JsonReq = {};
        if (parseInt(_CategoryID, 10) > 0) {
            JsonReq = {
                "CategoryID": parseInt(_CategoryID, 10),
                "cntry": {$in:[_CountryID]},
                "lng": {$in:[_LanguageID]},
                "cst": {$in:[parseInt(_CustomerTypeID, 10)]}
            };
        } else {
            JsonReq = {                
                "cntry": { $in: [_CountryID] },
                "lng": { $in: [_LanguageID] },
                "cst": { $in: [parseInt(_CustomerTypeID, 10)] }
            };
        }
        //console.log(JsonReq);
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              if (err) {
                  console.log(err);
                  response.send({ Response: err });
                  response.end();
                  db.close();
              } else {
                  db.collection("Resources", function (err, collection) {
                      if (err) {
                          console.log(err);
                          response.send({ Response: err });
                          response.end();
                          db.close();
                      } else {
                      collection.find(
                          JsonReq
                          , {}).toArray(function (err, results) {
                              if (err) {
                                  console.log(err);
                                  response.send({ Response: err });
                                  response.end();
                              } else {
                                  response.send(results);
                                  response.end();
                              }
                              db.close();
                          });
                  }
              });
          }
          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
exports.getAll = function (req, response) {
    try {
        console.log("call for get resources all");
        var _CategoryID = req.body.CategoryID;
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              db.collection("Resources", function (err, collection) {
                  if (_CategoryID === 0) {
                      collection.find({}, {}).toArray(function (err, results) {
                          if (err) {
                              console.log(err);
                              response.send({ Response: err });
                              response.end();
                          } else {
                              response.send(results);
                              response.end();
                          }
                          db.close();
                      });
                  } else {
                      collection.find({ "CategoryID": parseInt(_CategoryID, 10) }, {}).toArray(function (err, results) {
                          if (err) {
                              console.log(err);
                              response.send({ Response: err });
                              response.end();
                          } else {
                              response.send(results);
                              response.end();
                          }
                          db.close();
                      });
                  }
              });

          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
exports.add = function (request, response) {
    try {
        console.log("call for add resources");
        var JsonData = request.body;
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
      function (err, db) {
          db.collection("Resources")
                   .find({}, { resourceID: 1, _id: 0 }).sort({ resourceID: -1 }).limit(1).toArray(
                   function (err, results) {
                       if (err) {                         
                               console.log(err);
                               response.send({ Response: err });
                               response.end();                        
                           db.close();
                       }
                       else {
                           if (results[0] !== undefined) {
                               results.forEach(function (reTemp) {
                                   JsonData.resourceID = reTemp.resourceID + 1;
                                   db.collection('Resources').insert(JsonData, function (err, result) {
                                       if (err) {
                                           console.log(err);
                                           response.send({ Response: err });
                                           response.end();
                                       } else {
                                           response.send(result);
                                           response.end();
                                       }
                                       db.close();
                                   });
                               });
                           } else {
                               JsonData.resourceID = 1;
                               db.collection('Resources')
                                   .insert(JsonData,
                                   function (err, result) {
                                       if (err) {
                                           console.log(err);
                                           response.send({ Response: err });
                                           response.end();
                                       } else {
                                           response.send(result);
                                           response.end();
                                       }
                                       db.close();
                                   });
                           }
                       }
                   });
      });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
exports.update = function (request, response) {
    try {
        var _resourceID = request.body.resourceID;
        var _title = request.body.title;
        var _description = request.body.description;
        var _CategoryID = request.body.CategoryID;
        var _CategoryDescription = request.body.CategoryDescription;
        var _Tags = request.body.Tags;
        var _youtube_url = request.body.youtube_url;
        var _CustomerType = request.body.CustomerType;
        var _url = request.body.url;
        var _type = request.body.type;
        var _date = request.body.date;
        var _cst = request.body.cst;
        var _lng = request.body.lng;
        var _cntry = request.body.cntry;
        console.log('update resources' + _resourceID);
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
          function (err, db) {
              var data = "";
              if (err) {
                  console.log(err);
                  response.send({ Response: err });
                  response.end();
                  db.close();
              } else {
              db.collection("Resources", function (err, collection) {
                  if (err) {
                      console.log(err);
                      response.send({ Response: err });
                      response.end();
                      db.close();
                  } else  {
                      collection.find({ "resourceID": parseInt(_resourceID, 10) }, {})
                          .toArray(function (err, results) {
                              if (err) {
                                  console.log(err);
                                  response.send({ Response: err });
                                  response.end();
                                  db.close();
                              } else {
                                  if (results.length > 0) {
                                      results.forEach(function (doc) {
                                          doc.title = _title;
                                          doc.description = _description;
                                          doc.CategoryID = _CategoryID;
                                          doc.CategoryDescription = _CategoryDescription;
                                          doc.Tags = _Tags;
                                          doc.youtube_url = _youtube_url;
                                          doc.CustomerType = _CustomerType;
                                          doc.url = doc.url;
                                          doc.type = _type;
                                          doc.date = _date;
                                          doc.cst = _cst;
                                          doc.lng = _lng;
                                          doc.cntry = _cntry;                                          
                                          collection.update({ "resourceID": parseInt(_resourceID, 10) }, doc, { upsert: false }
                                                  , function (err, objects) {
                                                      if (err) {
                                                          console.log(err);
                                                          response.send({ Response: err });
                                                          response.end();
                                                          db.close();
                                                      } else {
                                                          console.log(objects);
                                                          response.send({ Response: objects });
                                                          response.end();
                                                          db.close();
                                                      }
                                                      
                                                  });
                                      });
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
exports.delete = function (request, response) {
    try {
        var _resourceID = request.body.resourceID;

        console.log("call for del resources" + _resourceID);
        MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
         function (err, db) {
             var fileOnRack = "";
             if (err) {
                 console.log(err);
                 response.send({ Response: err });
                 response.end();
                 db.close();
             } else {
                 db.collection("Resources", function (err, collection) {
                     if (err) {
                         console.log(err);
                         response.send({ Response: err });
                         response.end();
                         db.close();
                     } else {
                         collection.find({ resourceID: parseInt(_resourceID, 10) }, {})
                             .toArray(function (err, results) {
                                 if (err) {
                                     console.log(err);
                                     response.send({ Response: err });
                                     response.end();
                                     db.close();
                                 } else {

                                     if (results.length > 0) {

                                         //console.log(results);
                                         results.forEach(function (doc) {
                                             console.log(doc);
                                             if (doc.type === 1) {
                                                 fileOnRack = doc.url;
                                                 client.removeFile("myResource", fileOnRack, function (err, result) {
                                                     if (err) {
                                                         console.log(err);
                                                         response.send({ Response: err });
                                                         response.end();
                                                         db.close();
                                                     } else {
                                                         collection.remove({ resourceID: parseInt(_resourceID, 10) },
                                                             function (err, result) {
                                                                 if (err) {
                                                                     console.log(err);
                                                                     response.send({ Response: err });
                                                                     response.end();
                                                                     db.close();
                                                                 } else {
                                                                     response.send({ Response: result });
                                                                     response.end();
                                                                     db.close();
                                                                 }

                                                             });
                                                     }
                                                 });
                                             } else {
                                                 collection.remove({ resourceID: parseInt(_resourceID, 10) },
                                                     function (err, result) {
                                                         if (err) {
                                                             console.log(err);
                                                             response.send({ Response: err });
                                                             response.end();
                                                             db.close();
                                                         } else {
                                                             response.send({ Response: result });
                                                             response.end();
                                                             db.close();
                                                         }

                                                     });
                                             }
                                         });
                                     } else {
                                         response.send({ Response: 'Record not found to perform delete operation!!' });
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
exports.upload = function (request, response) {
    try {
        var JsonData = {};
        JsonData = JSON.parse(request.body.JsonData);
        console.log("Upload file resource");
        console.log(request.body.JsonData);
        /////
        var _title = JsonData.title;
        var _description = JsonData.description;
        var _CategoryID = JsonData.CategoryID;
        var _CategoryDescription = JsonData.CategoryDescription;
        var _Tags = JsonData.Tags;
        var _youtube_url = JsonData.youtube_url;
        var _CustomerType = JsonData.CustomerType;
        var _url = JsonData.url;
        var _type = JsonData.type;
        var _date = JsonData.date;
        var _cst = JsonData.cst;
        var _lng = JsonData.lng;
        var _cntry = JsonData.cntry;
        /////
        console.log("BEFORE GET PATH FROM REQUEST FILE" + _title);
        var req_remote_path = request.files.file.path;
        console.log("BEFORE FIND BASE PATH");
        var remote_file_name = path.basename(req_remote_path);
        _url = remote_file_name;

        console.log("OPERATION " + request.body.Operation + " : BEFORE MONGO CONNECT");
        if (parseInt(request.body.Operation, 10) === 0) {
            //add

            MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
      function (err, db) {
          db.collection("Resources").find({}, { resourceID: 1, _id: 0 }).sort({ resourceID: -1 }).limit(1).toArray(
                   function (err, results) {
                       console.log("FIND CALL");
                       if (err) {
                           console.log("FIND CALL ERROR");
                           console.log(err);
                       }
                       else {
                           console.log("FIND CALL NOT ERROR \n");
                           console.log("FIND CALL RESULT[0]" + results[0]);
                           if (results[0] !== undefined) {
                               results.forEach(function (reTemp) {
                                   console.log("ENTER IN LOOP FOR FIND");
                                   db.collection('Resources').insert(
                                       {
                                           resourceID: parseInt(reTemp.resourceID, 10) + 1,
                                           title: _title,
                                           description: _description,
                                           CategoryID: _CategoryID,
                                           CategoryDescription: _CategoryDescription,
                                           Tags: _Tags,
                                           youtube_url: _youtube_url,
                                           CustomerType: _CustomerType,
                                           url: _url,
                                           type: parseInt(_type, 10),
                                           date: _date,
                                           cst: _cst,
                                           lng: _lng,
                                           cntry: _cntry
                                       },


                                       function (err, result) {
                                           //start upload to rackspace
                                           console.log("insert result" + result);
                                           if (result && (_url !== '' || _url !== undefined || _url !== null)) {

                                               console.log("BEFORE READ FILE FROM NODE TO SEND ON RACK");
                                               var myFile = fs.createReadStream(req_remote_path);// request.files.file;//fs.createReadStream('d:\\test.txt');

                                               myFile.pipe(client.upload({
                                                   container: 'myResource',
                                                   remote: remote_file_name
                                               }, function (err, results) {
                                                   if (results) {
                                                       console.log("UPLOAD TO RACK");
                                                       fs.unlink(req_remote_path, function (err, result) {
                                                           if (result) { response.send({ Response: result }); }
                                                           if (err) { response.send({ Response: err }); console.log(err); }
                                                       });

                                                   }
                                                   else {
                                                       console.log("ERROR UPLOAD TO RACK");
                                                       console.log(err);
                                                       response.send({ Response: err });
                                                   }
                                                   response.end();
                                                   db.close();
                                               }));
                                           }
                                           else {
                                               response.send({ Response: "Not uploaded at Node" + err });
                                               response.end();
                                               db.close();
                                           }

                                       });
                               });
                           } else {//first record                    
                               db.collection('Resources')
                                   .insert(
                                   {
                                       resourceID: 1,
                                       title: _title,
                                       description: _description,
                                       CategoryID: _CategoryID,
                                       CategoryDescription: _CategoryDescription,
                                       Tags: _Tags,
                                       youtube_url: _youtube_url,
                                       CustomerType: _CustomerType,
                                       url: _url,
                                       type: parseInt(_type, 10),
                                       date: _date,
                                       cst: _cst,
                                       lng: _lng,
                                       cntry: _cntry
                                   },
                                   function (err, result) {
                                       //start upload to rackspace
                                       console.log("insert result" + result);
                                       if (result && (_url !== '' || _url !== undefined || _url !== null)) {

                                           console.log("BEFORE READ FILE FROM NODE TO SEND ON RACK");
                                           var myFile = fs.createReadStream(req_remote_path);// request.files.file;//fs.createReadStream('d:\\test.txt');

                                           myFile.pipe(client.upload({
                                               container: 'myResource',
                                               remote: remote_file_name
                                           }, function (err, results) {
                                               if (results) {
                                                   console.log("UPLOAD TO RACK");
                                                   fs.unlink(req_remote_path, function (err, result) {
                                                       if (result) { response.send({ Response: result }); }
                                                       if (err) { response.send({ Response: err }); console.log(err); }
                                                   });

                                               }
                                               else {
                                                   console.log("ERROR UPLOAD TO RACK");
                                                   console.log(err);
                                                   response.send({ Response: err });
                                               }
                                               response.end();
                                               db.close();
                                           }));
                                       }
                                       else {
                                           response.send({ Response: "Not uploaded at Node" + err });
                                           response.end();
                                           db.close();
                                       }

                                   });
                           }
                       }
                   });
      });
        }
        else {
            //update  currently not called due to requirement we would not need to update upload new file for update

            var _resourceID = JsonData.resourceID;
            MongoClient.connect('mongodb://127.0.0.1:27017/resourceLibarary',
            function (err, db) {
                var data = "";

                db.collection("Resources", function (err, collection) {
                    console.log("FIND CALL for resourceID" + _resourceID);
                    collection.find({ resourceID: _resourceID }, {})
                        .toArray(function (err, results) {
                            if (results !== undefined) {
                                console.log("\n results");
                                console.log(results);
                                results.forEach(function (doc) {
                                    console.log("\n each result" + doc);
                                    doc.title = _title;
                                    doc.description = _description;
                                    doc.CategoryID = _CategoryID;
                                    doc.CategoryDescription = _CategoryDescription;
                                    doc.Tags = _Tags;
                                    doc.youtube_url = _youtube_url;
                                    doc.CustomerType = _CustomerType;
                                    doc.url = _url;
                                    doc.type = _type;
                                    doc.date = _date;
                                    doc.cst = _cst;
                                    doc.lng = _lng;
                                    doc.cntry = _cntry;
                                    collection.update({ "resourceID": _resourceID }, doc, { upsert: false }
                                            , function (err, objects) {
                                                console.log("update result" + objects);
                                                if (objects && (_url !== '' || _url !== undefined || _url !== null)) {
                                                    console.log("BEFORE READ FILE FROM NODE TO SEND ON RACK");
                                                    var myFile = fs.createReadStream(req_remote_path);// request.files.file;//fs.createReadStream('d:\\test.txt');

                                                    myFile.pipe(client.upload({
                                                        container: 'myResource',
                                                        remote: remote_file_name
                                                    }, function (err, results) {
                                                        if (results) {
                                                            console.log("UPLOAD TO RACK");
                                                            fs.unlink(req_remote_path, function (err, result) {
                                                                if (result) { response.send({ Response: result }); }
                                                                if (err) { response.send({ Response: err }); console.log(err); }
                                                            });

                                                        }
                                                        else {
                                                            console.log("ERROR UPLOAD TO RACK");
                                                            console.log(err);
                                                            response.send({ Response: err });
                                                        }
                                                        response.end();
                                                        db.close();
                                                    }));
                                                }
                                                else {
                                                    response.send({ Response: "Not uploaded at Node" + err });
                                                    response.end();
                                                    db.close();
                                                }

                                            });
                                });
                            }
                            else {
                                console.log("\n error in find result" + err);
                                response.end();
                                db.close();
                            }
                        });
                });
            });
        }
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};
exports.updateRecords=function (request, response) {
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
                  db.collection("Resources", function (err, collection) {
                      if (err) {
                          console.log(err);
                          response.send({ Response: err });
                          response.end();
                          db.close();
                      } else  {
                          collection.find({}, {}).sort({ resourceID: 1 })
                              .toArray(function (err, results) {
                                  if (err) {
                                      console.log(err);
                                      response.send({ Response: err });
                                      response.end();
                                      db.close();
                                  } else {
                                      if (results.length > 0) {
                                          var _resourceID = 0;
                                          results.forEach(function (doc) {
                                              if (doc !== undefined) {
                                                  var i = 0;
                                                  _resourceID = doc.resourceID;
                                                  //for correction in input container of language tag
                                                  if (doc.Tags[1].values !== undefined) {
                                                      if (doc.Tags[1].values.length > 0) {
                                                          while (doc.Tags[1].values.length > i) {
                                                              if (i === 0) { doc.Tags[1].values[i].code = "EN"; }
                                                              if (i === 1) { doc.Tags[1].values[i].code = "ES"; }
                                                              if (i === 2) { doc.Tags[1].values[i].code = "FR"; }
                                                              i++;
                                                          }
                                                      }
                                                  }
                                                  //if youtube url null & type is 1 then
                                                  if (doc.type !== undefined) {
                                                      if (doc.type !== 'undefined') {
                                                          if (doc.type !== null) {
                                                              if (doc.type === 1) {
                                                                  if (doc.youtube_url !== undefined)
                                                                  {
                                                                      if (doc.youtube_url !== 'undefined') {
                                                                          if (doc.youtube_url !== null) {

                                                                          } else {
                                                                              console.log(doc.resourceID + 'wrong null');
                                                                              doc.youtube_url = 'youTubeUrl';
                                                                          }
                                                                      } else {
                                                                          console.log(doc.resourceID + 'wrong qout undefined');
                                                                          doc.youtube_url = 'youTubeUrl';
                                                                      }
                                                                  } else {
                                                                      console.log(doc.resourceID + 'wrong undefined');
                                                                      doc.youtube_url = 'youTubeUrl';
                                                                  }
                                                              }
                                                          } else {
                                                              console.log(doc.resourceID + 'wrong null');
                                                              doc.type = 2;
                                                          }
                                                      } else {
                                                          console.log(doc.resourceID + 'wrong qout undefined');
                                                          doc.type = 2;
                                                      }
                                                  } else {
                                                      console.log(doc.resourceID + 'wrong undefined');
                                                      doc.type = 2;
                                                  }
                                                  
                                                  //wrong cst correction
                                                  if (doc.cst !== undefined) {
                                                      if (doc.cst !== 'undefined') {
                                                          if (doc.cst !== null) {
                                                          } else {
                                                              console.log(doc.resourceID + 'wrong null');
                                                              doc.cst = [];
                                                          }
                                                      } else {
                                                          console.log(doc.resourceID + 'wrong qout undefined');
                                                          doc.cst = [];
                                                      }
                                                  } else {
                                                      console.log(doc.resourceID + 'wrong undefined');
                                                      doc.cst = [];
                                                  }
                                                  //wrong cntry correction
                                                  if (doc.cntry !== undefined) {
                                                      if (doc.cntry !== 'undefined') {
                                                          if (doc.cntry !== null) {
                                                          } else {
                                                              console.log(doc.resourceID + 'wrong null');
                                                              doc.cntry = [];
                                                          }
                                                      } else {
                                                          console.log(doc.resourceID + 'wrong qout undefined');
                                                          doc.cntry = [];
                                                      }
                                                  } else {
                                                      console.log(doc.resourceID + 'wrong undefined');
                                                      doc.cntry = [];
                                                  }
                                                  i = 0;
                                                  //for correction in selected language tag
                                                  if (doc.lng !== undefined) {
                                                      if (doc.lng !== 'undefined') {
                                                          if (doc.lng !== null) {
                                                              console.log(doc.lng);
                                                              if (doc.lng.length > 0) {
                                                                  while (doc.lng.length > i) {
                                                                      if (doc.lng[i] !== null || doc.lng[i] !== undefined) {
                                                                          if (doc.lng[i] === 0) { doc.lng[i] = "EN"; }
                                                                          if (doc.lng[i] === 373) { doc.lng[i] = "ES"; }
                                                                          if (doc.lng[i] === 311) { doc.lng[i] = "FR"; }
                                                                      }
                                                                      i++;
                                                                  }
                                                              }
                                                          } else {
                                                              console.log(doc.resourceID + 'wrong null');
                                                              doc.lng = [];
                                                          }
                                                      } else {
                                                          console.log(doc.resourceID + 'wrong qout undefined');
                                                          doc.lng = [];
                                                      }
                                                  } else {
                                                      console.log(doc.resourceID + 'wrong undefined');
                                                      doc.lng = [];
                                                  }
                                                  
                                                  //for correction in CustomerTypeID "1" to 1
                                                  if (doc.CustomerType.length !== undefined) {
                                                      if (doc.CustomerType.length > 0) {
                                                          if (doc.CustomerType[0].id === '1') { doc.CustomerType[0].id = 1; }
                                                      }
                                                  }
                                                  console.log(doc.CustomerType);

                                                  collection.update({ "resourceID": doc.resourceID }, doc, { upsert: false }
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