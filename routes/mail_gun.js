var MongoClient = require('mongodb').MongoClient;
exports.get_mail=function(request, response ) {
var _recipient=request.body.recipient;
var _sender=request.body.sender;
var _subject=request.body.subject;
var _from=request.body.from;
var _Date=request.body.Date;

var _body_plain=request.body['body-plain'];
var _body_html=request.body['body-html'];

console.log("_recipient:"+_recipient);
console.log("_sender:"+_sender);
console.log("_subject:"+_subject);
console.log("_from:"+_from);
console.log("_Date:"+_Date);
console.log("_body_plain:"+_body_plain);
console.log("_body_html:" + _body_html);
    //For getting customerId
////var url_test='/5.0/ClientApi.jsonp?callback=angular.callbacks._a&env=test&r=%7B%22requestType%22:%22GetDownline%22,%22sessionToken%22:%22d71e7041-4a89-402d-acc1-a1ca5c2b3ba7%22,%22requestObj%22:%7B%22TreeType%22:%22Enroller%22,%22CustomerID%22:%2296342802%22,%22PeriodType%22:1,%22PeriodID%22:1,%22MaxLevelDepth%22:8,%22CustomerTypes%22:%5B1%5D,%22Ranks%22:1,%22PayRanks%22:1,%22VolumeFilters%22:%22Volume1%22%7D%7D';
////var url = 'https://hydra.unicity.net:8123/5.0/ClientApi.jsonp?callback=angular.callbacks._a&env=test&r=%7B%22requestType%22:%22GetDownline%22,%22sessionToken%22:%22d71e7041-4a89-402d-acc1-a1ca5c2b3ba7%22,%22requestObj%22:%7B%22TreeType%22:%22Enroller%22,%22CustomerID%22:%2296342802%22,%22PeriodType%22:1,%22PeriodID%22:1,%22MaxLevelDepth%22:8,%22CustomerTypes%22:%5B1%5D,%22Ranks%22:1,%22PayRanks%22:1,%22VolumeFilters%22:%22Volume1%22%7D%7D';
//var http = require('http');
////var hydra = http.createClient(8123, 'hydra.unicity.net');
////var request = hydra.request('GET', url_test,
////  { 'host': 'hydra.unicity.net' });
////request.end();
////request.on('response', function (response) {
////    console.log('STATUS: ' + response.statusCode);
////    console.log('HEADERS: ' + JSON.stringify(response.headers));
////    response.setEncoding('utf8');
////    response.on('data', function (chunk) {

////        console.log('BODY: ' + chunk);
////    });
////});

////if (_Date === null)
////{ _Date = new Date(); }
////var message = new Messages(parseInt(obj.CustomerID, 10), -5, _Date, Enum.MessageStatuses.Unread,
////        _subject, _body_html, _sender, -5, _recipient, parseInt(obj.CustomerID, 10), 'from mailgun',
////        Enum.MessageFolders.Inbox);

////MongoClient.connect('mongodb://127.0.0.1:27017/mail_gun',
////    function (err, dbm) {
////        dbm.collection('mail_box').find({ "Recipient": 'anirudh@myunicity.com' }).toArray(function (err, docsm) {
////            if (docsm.length > 0) {
////                docsm.forEach(function (docm) {
////                    if (docm.Date == null) { docm.Date = new Date(); }

                    
////                    //console.log(message);
////                    MessagesResponse.push(message);

////                });

////                res.send(MessagesResponse);
////            } else {
////                res.send(MessagesResponse);
////                console.log("No msg in mailgun");
////            }
////        });
////    });
        //console.log("call add customerTypes");
if(_Date ===null)
{ _Date = new Date();}
        MongoClient.connect('mongodb://127.0.0.1:27017/mail_gun',
          function (err, db) {
              var data = "";
              db.collection("mail_box")
                  .count({ id: { $exists: true } },
                  function (err, results) {
                      db.close();
                      if (err) {
                          console.log(err);
                      }
                      else {
                          var id = 0;
                          id = results + 1;
                          var name = _recipient;
                          MongoClient.connect('mongodb://127.0.0.1:27017/mail_gun',
                            function (err, db) {
                                db.collection('mail_box')
                                    .insert(
                                    {

"Recipient":_recipient,
"Sender":_sender,
"Subject":_subject,
"From":_from,
"Date":_Date,
"Body_plain":_body_plain,
"Body_html":_body_html,
"MessageStatusID":-5
                                    },
                                    function (err, result) {
                                            response.send('OK');
					    response.end();
                                        db.close();
                                        if (err) { console.log(err); }
                                    });
                            });
                      }
                  });
          });


};

exports.get = function (req, response) {
    try {
        console.log("call get mail_gun");
        MongoClient.connect('mongodb://127.0.0.1:27017/mail_gun',
          function (err, db) {
              var data = "";
              db.collection("mail_box", function (err, collection) {
                  collection.find({}, {})
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
function Messages(CustomerID, MessageID, MessageDate, MessageStatusID, Subject, Body, From, FromCustomerID, To, ToCustomerID, Notes, MessageFolderID) {
    this.CustomerID = CustomerID;
    this.MessageID = MessageID;
    this.MessageDate = MessageDate;
    this.MessageStatusID = MessageStatusID;
    this.Subject = Subject;
    this.Body = Body;
    this.From = From;
    this.FromCustomerID = FromCustomerID;
    this.To = To;
    this.ToCustomerID = ToCustomerID;
    this.Notes = Notes;
    this.MessageFolderID = MessageFolderID;
}
var Enum = {
    MessageStatuses: { Unread: 1, Read: 2, Forwarded: 3, Replied: 4 },
    MessageFolders: { Inbox: 1, Sent: 2, Drafts: 3, Deleted: 4 }
};

//MongoClient.connect('mongodb://127.0.0.1:27017/mail_gun',
//                           function (err, dbm) {
//                               dbm.collection('mail_box').find({ "To": ToAddress }).toArray(function (err, docsm) {
//                                   docsm.forEach(function (docm) {
//                                       docm.CustomerID = obj.CustomerID;
//                                       docm.ToCustomerID = obj.CustomerID;
//                                       docm.MessageID = -5;
//                                       docm.MessageDate = docm.MessageDate;
//                                       docm.MessageStatusID = Enum.MessageStatuses.Unread;
//                                       docm.MessageFolderID = Enum.MessageFolders.Inbox;
//                                       docm.Subject = docm.Subject;
//                                       docm.Body = docm.Body;
//                                       docm.From = docm.From;
//                                       docm.FromCustomerID = -5;
//                                       docm.To = docm.To;
//                                       docm.Notes = '';
//                                       var rq = docm;
//                                       rq.Recipients[0].Firstname = '';
//                                       rq.Recipients[0].Lastname = '';
//                                       rq.Recipients.id = -5;
//                                       MessagesResponse.push(message);
//                                       mongo.connect(connectionstringMessageApp, function (err, db) {
//                                           if (db != null && db != undefined) {
//                                               SendNewMessage(db, rq, function () {

//                                               });
//                                           }
//                                       });

//                                   });
//                               });
//                           });