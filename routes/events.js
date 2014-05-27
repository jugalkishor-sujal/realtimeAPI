var mongo = require('mongodb').MongoClient;
var connectionString = 'mongodb://127.0.0.1:27017/events';


exports.get = function (req, response) {
    try {
        mongo.connect(connectionString,
          function (err, db) {
              var data = "";
              db.collection("events", function (err, collection) {
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

///  add events 
exports.add = function (request, response) {
    try {
        var JsonData = request.body;
        mongo.connect(connectionString,
        function (err, db) {
            db.collection('events').count({ eventID: { $exists: true } }, function (err, result) {
                JsonData.eventID = result + 1;
                db.close();
                mongo.connect(connectionString,
        function (err, db) {
            db.collection('events').insert(JsonData, function (err, result) {
                response.send(result);
                response.end();
                db.close();
                if (err) { console.log(err); }
            });

        });
            });
        });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};

exports.update = function (request, response) {
    try {
        var _eventID = request.body.eventID;
        var _data = request.body;

        mongo.connect(connectionString,
          function (err, db) {
              db.collection('events').find({ "eventID":_eventID }, {
                  eventID: 1,
                  eventPrivacyType: 1,
                  eventType: 1,
                  eventRepeatType: 1,
                  eventTimeZoneType: 1,
                  eventTitle: 1,
                  eventSummary: 1,
                  eventLocation: 1,
                  eventAllDay: 1,
                  eventStartDate: 1,
                  eventStartTime: 1,
                  eventEndDate: 1,
                  eventEndTime: 1,
                  eventPersonal: 1,
                  eventCustomerID: 1,
                  eventByFName: 1,
                  eventByLName: 1
              }).sort({ eventID: 1 })
                      .toArray(function (err, results) {
                          results.forEach(function (doc) {

                            //  doc.eventID = _eventID;
                              doc.eventPrivacyType = _data.eventPrivacyType;
                              doc.eventType = _data.eventType;
                              doc.eventRepeatType = _data.eventRepeatType;
                              doc.eventTimeZoneType = _data.eventTimeZoneType;
                              doc.eventTitle = _data.eventTitle;
                              doc.eventSummary = _data.eventSummary;
                              doc.eventLocation = _data.eventLocation;
                              doc.eventAllDay = _data.eventAllDay;
                              doc.eventStartDate = _data.eventStartDate;
                              doc.eventStartTime = _data.eventStartTime;
                              doc.eventEndDate = _data.eventEndDate;
                              doc.eventEndTime = _data.eventEndTime;
                              doc.eventPersonal = _data.eventPersonal;
                              doc.eventCustomerID = _data.eventCustomerID;
                              doc.eventByFName = _data.eventByFName;
                              doc.eventByLName = _data.eventByLName;

                              db.collection('events').update({ "eventID": _eventID }, doc, { upsert: false },
                     function (err, result) {
                         response.send({ Response: result });
                         
                         db.close();
                         if (err) { response.send({ Response: err }); console.log(err); }
                         response.end();
                     });
                          });
                      });

          });
    }
    catch (ex) { console.log("\n Exception #" + ex); response.send({ Response: ex }); response.end(); }
};

exports.delete = function (request, response) {
    try {
        var _eventID = request.body.eventID;
        //console.log("call for delete events");

        mongo.connect(connectionString,
          function (err, db) {
              db.collection('events').remove(
                  {
                      eventID: _eventID
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
