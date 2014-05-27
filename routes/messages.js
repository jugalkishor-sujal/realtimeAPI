var MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb').MongoClient;
var connectionstringMessageApp = "mongodb://127.0.0.1:27017/MessageApplication";
exports.InstallDB = function (req, res) {
    try {
        mongo.connect(connectionstringMessageApp, function (err, db) {
            if (db != null && db != undefined) {
                InstallDBStructure(db);
                res.send("is Created.");
            }
            else {
                //console.log("not connected to db");
                res.send("not connected to db");
            }
        });
    }
    catch (Ex) {
        //console.log(Ex);
        res.send("Error : " + Ex);
    }
};

exports.SendMessage = function (req, res) {
    try {

        var request = req.body;
        mongo.connect(connectionstringMessageApp, function (err, db) {
            if (db != null && db != undefined) {
                SendNewMessage(db, request, function () {
                    res.send("Message sent successfully.");
                });
            }
            else {
                //console.log("not connected to db");
                res.send("not connected to db");
            }
        });

    }
    catch (Ex) {
        //console.log(Ex);
        res.send("Error : " + Ex);
    }
};
exports.SaveDraftMessage = function (req, res) {
    try {

        var request = req.body;
        mongo.connect(connectionstringMessageApp, function (err, db) {
            if (db != null && db != undefined) {
                SaveDraftMessage(db, request, function () {
                    res.send("Message saved successfully.");
                });
            }
            else {
                //console.log("not connected to db");
                res.send("not connected to db");
            }
        });

    }
    catch (Ex) {
        //console.log(Ex);
        res.send("Error : " + Ex);
    }
};
exports.GetMessages = function (req, res) {
    try {

        var obj = req.body;
        mongo.connect(connectionstringMessageApp, function (err, db) {
            if (db != null && db != undefined) {
                var collection = db.collection("Messages");
                var MessagesResponse = [];
                var ToAddress = '';
                // Cursor has an to array method that reads in all the records to memory
                collection.find({ 'CustomerID': obj.CustomerID, 'MessageFolderID': obj.MessageFolderID }).sort({ "MessageDate": -1 }).toArray(function (err, docs) {
                    docs.forEach(function (doc) {
                        //get all msg from local
                        //associate 
                        var message = new Messages(doc.CustomerID, doc.MessageID, doc.MessageDate, doc.MessageStatusID,
                            doc.Subject, doc.Body, doc.From, doc.FromCustomerID, doc.To, doc.ToCustomerID, doc.Notes,
                            doc.MessageFolderID);
                        MessagesResponse.push(message);
                    });
                    if (obj.CustomerID === "102183101" && (obj.MessageFolderID === 1 || obj.MessageFolderID === 2)) {
                        MongoClient.connect('mongodb://127.0.0.1:27017/mail_gun',
         function (err, dbm) {
             dbm.collection('mail_box').find({ "Recipient": 'anirudh@myunicity.com' }).toArray(function (err, docsm) {
                 if (docsm.length > 0) {
                     docsm.forEach(function (docm) {
                         if (docm.Date == null) { docm.Date = new Date(); }

                         var message = new Messages(parseInt(obj.CustomerID, 10), -5, docm.Date, Enum.MessageStatuses.Unread,
             docm.Subject, docm.Body_html, docm.From, -5, docm.Recipient, parseInt(obj.CustomerID, 10), '',
             Enum.MessageFolders.Inbox);
                         console.log(message);
                         MessagesResponse.push(message);

                     });

                     res.send(MessagesResponse);
                 } else {
                     res.send(MessagesResponse);
                     console.log("No msg in mailgun");
                 }
             });
         });
                    } else {
                        res.send(MessagesResponse);
                    }
                    //console.log("GetMessages is Called.");
                    //var customer = new Customers(1, "Mac", "Col", "test@test.com", "154585");
                    //CreateCustomerRequest(db, customer);
                });

            }
            else {
                //console.log("not connected to db");
                res.send("not connected to db");
            }
        });

    }
    catch (Ex) {
        console.log(Ex);
        res.send("Error : " + Ex);
    }
};

exports.GetMessageFolders = function (req, res) {
    try {

        var CustomerID = req.body.CustomerID;
        mongo.connect(connectionstringMessageApp, function (err, db) {
            if (db != null && db != undefined) {
                var collection = db.collection("MessageFolders");
                var messagesFolderResponse = [];
                // Cursor has an to array method that reads in all the records to memory


                collection.find({ 'CustomerID': CustomerID }).count(function (err, count) {
                    if (count == 0) {
                        CreateDefaultMessageFolders(db, CustomerID);
                        //console.log("User has no folders");
                        res.send(messagesFolderResponse);
                    }
                    else {
                        collection.find({ 'CustomerID': CustomerID }).sort({ MessageFolderID: 1 }).toArray(function (err, docs) {
                            docs.forEach(function (doc) {
                                var messageFolders = new MessageFoldersResponse(doc.CustomerID, doc.MessageFolderID, doc.MessageFolderDescription, 0);
                                messagesFolderResponse.push(messageFolders);

                            });
                            res.send(messagesFolderResponse);
                            //console.log("GetMessageFolders is Called.");
                        });
                    }
                });

            }
            else {
                //console.log("not connected to db");
                res.send("not connected to db");
            }
        });

    }
    catch (Ex) {
        //console.log(Ex);
        res.send("Error : " + Ex);
    }
};

exports.CreateMessageFolder = function (req, res) {
    try {

        var obj = req.body;
        mongo.connect(connectionstringMessageApp, function (err, db) {
            if (db != null && db != undefined) {
                var collection = db.collection("MessageFolders");
                // Cursor has an to array method that reads in all the records to memory
                collection.find({ 'CustomerID': obj.CustomerID, MessageFolderDescription: obj.MessageFolderDescription }).count(function (err, count) {
                    if (count == 0) {
                        CreateMessageFolders(db, obj.CustomerID, obj.MessageFolderDescription);
                        //console.log("Folder Created Successfully.");
                        res.send("Folder Created Successfully.");
                    }
                    else {
                        //console.log("Folder with same name already exists.");
                        res.send("Folder with same name already exists.");
                    }

                });

            }
            else {
                //console.log("not connected to db");
                res.send("not connected to db");
            }
        });

    }
    catch (Ex) {
        //console.log(Ex);
        res.send("Error : " + Ex);
    }
};
exports.DeleteMessageFolders = function (req, res) {
    try {

        var obj = req.body;
        //console.log(obj);
        mongo.connect(connectionstringMessageApp, function (err, db) {
            if (db != null && db != undefined) {
                // Cursor has an to array method that reads in all the records to memory
                DeleteMessageFolders(db, obj.CustomerID, obj.MessageFolderID);
                //console.log("Folder Deleted Successfully.");
                res.send("Folder Deleted Successfully.");
            }
            else {
                //console.log("not connected to db");
                res.send("not connected to db");
            }
        });

    }
    catch (Ex) {
        //console.log(Ex);
        res.send("Error : " + Ex);
    }
};

exports.UpdateMessageFolders = function (req, res) {
    try {

        var obj = req.body;
        mongo.connect(connectionstringMessageApp, function (err, db) {
            if (db != null && db != undefined) {
                // Cursor has an to array method that reads in all the records to memory
                UpdateMessageFolders(db, obj.CustomerID, obj.MessageFolderID, obj.MessageFolderDescription);
                //console.log("Folder Updated Successfully.");
                res.send("Folder Updated Successfully.");
            }
            else {
                //console.log("not connected to db");
                res.send("not connected to db");
            }
        });

    }
    catch (Ex) {
        //console.log(Ex);
        res.send("Error : " + Ex);
    }
};
exports.GetSingleMessage = function (req, res) {
    try {
        var obj = req.body;
        mongo.connect(connectionstringMessageApp, function (err, db) {
            if (db != null && db != undefined) {
                var collection = db.collection("Messages");
                var MessagesResponse = new Messages();
                // Cursor has an to array method that reads in all the records to memory
                collection.find({ 'CustomerID': obj.CustomerID, 'MessageID': obj.MessageID }, { 'limit': 1 }).toArray(function (err, docs) {
                    docs.forEach(function (doc) {
                        //var message = new Messages(doc.CustomerID, doc.MessageID, doc.MessageDate, doc.MessageStatusID,
                        //    doc.Subject, doc.Body, doc.From, doc.FromCustomerID, doc.To, doc.ToCustomerID, doc.Notes,
                        //    doc.MessageFolderID);
                        MessagesResponse = new Messages(doc.CustomerID, doc.MessageID, doc.MessageDate, doc.MessageStatusID,
                            doc.Subject, doc.Body, doc.From, doc.FromCustomerID, doc.To, doc.ToCustomerID, doc.Notes,
                            doc.MessageFolderID);

                    });

                    if (obj.CustomerID === "102183101" & obj.MessageID===-5) {
                        MongoClient.connect('mongodb://127.0.0.1:27017/mail_gun',
         function (err, dbm) {
             dbm.collection('mail_box').find({ "Recipient": 'anirudh@myunicity.com',"Subject":'test1' }).toArray(function (err, docsm) {
                 if (docsm.length > 0) {
                     docsm.forEach(function (docm) {
                         if (docm.Date == null) { docm.Date = new Date(); }

                         MessagesResponse = new Messages(parseInt(obj.CustomerID, 10), -5, docm.Date, Enum.MessageStatuses.Unread,
             docm.Subject, docm.Body_html, docm.From, -5, docm.Recipient, parseInt(obj.CustomerID, 10), '',
             Enum.MessageFolders.Inbox);
                         console.log(MessagesResponse);
                         //MessagesResponse.push(message);

                     });

                     res.send(MessagesResponse);
                 } else {
                     res.send(MessagesResponse);
                     console.log("No msg in mailgun");
                 }
             });
         });
                    } else {
                        res.send(MessagesResponse);
                    }
                    //console.log("GetSingleMessage is Called.");
                });

            }
            else {
                //console.log("not connected to db");
                res.send("not connected to db");
            }
        });

    }
    catch (Ex) {
        //console.log(Ex);
        res.send("Error : " + Ex);
    }
};

///  Move Message to a folder
exports.movemessagestofolder = function (req, res) {
    try {

        var obj = req.body;
        mongo.connect(connectionstringMessageApp, function (err, db) {
            if (db != null && db != undefined) {
                //ids: [settings.messageID],
                //folder: argument
                // Cursor has an to array method that reads in all the records to memory
                MoveMessageToFolder(db, obj.MessageIDs, obj.MessageFolderID);
                //console.log("Folder Moved Successfully.");
                res.send("Folder Moved Successfully.");
            }
            else {
                //console.log("not connected to db");
                res.send("not connected to db");
            }
        });

    }
    catch (Ex) {
        //console.log(Ex);
        res.send("Error : " + Ex);
    }
};

///  Change Message statues
exports.changemessagestatuses = function (req, res) {
    try {

        var obj = req.body;
        mongo.connect(connectionstringMessageApp, function (err, db) {
            if (db != null && db != undefined) {
                //ids: [settings.messageID],
                //folder: argument
                // Cursor has an to array method that reads in all the records to memory
                ChangeMessageStatues(db, obj.MessageIDs, obj.MessageStatusID);
                //console.log("Folder Moved Successfully.");
                res.send("Folder Moved Successfully.");
            }
            else {
                //console.log("not connected to db");
                res.send("not connected to db");
            }
        });

    }
    catch (Ex) {
        //console.log(Ex);
        res.send("Error : " + Ex);
    }
};
///  get matching recipients
exports.getmatchingrecipients = function (req, res) {
    try {

        var obj = req.body;
        mongo.connect(connectionstringMessageApp, function (err, db) {
            if (db != null && db != undefined) {
                // Cursor has an to array method that reads in all the records to memory
                var records = [
                    { "id": 12, "type": 1, "name": "ABC", "email": "abc@fgi.com", "IsDistributor": true, "IsLead": false },
                    { "id": 13, "type": 1, "name": "Patric", "email": "abc@fgi.com", "IsDistributor": true, "IsLead": false },
                    { "id": 14, "type": 1, "name": "Pasto", "email": "abc@fgi.com", "IsDistributor": true, "IsLead": false },
                    { "id": 15, "type": 1, "name": "Alice", "email": "abc@fgi.com", "IsDistributor": true, "IsLead": false },
                    { "id": 16, "type": 1, "name": "Victor", "email": "abc@fgi.com", "IsDistributor": true, "IsLead": false }];

                res.send(records);
            }
            else {
                //console.log("not connected to db");
                res.send("not connected to db");
            }
        });

    }
    catch (Ex) {
        //console.log(Ex);
        res.send("Error : " + Ex);
    }
};


//ProtoTypes
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

function MessageFolders(CustomerID, MessageFolderID, MessageFolderDescription) {
    this.CustomerID = CustomerID;
    this.MessageFolderID = MessageFolderID;
    this.MessageFolderDescription = MessageFolderDescription;
}
function MessageFolderTypes(MessageFolderTypeID, MessageFolderTypeDescription) {
    this.MessageFolderTypeID = MessageFolderTypeID;
    this.MessageFolderTypeDescription = MessageFolderTypeDescription;
}

function MessageStatuses(MessageStatusID, MessageStatusDescription, Read, Replied, Forwarded) {
    this.MessageStatusID = MessageStatusID;
    this.MessageStatusDescription = MessageStatusDescription;
    this.Read = Read;
    this.Replied = Replied;
    this.Forwarded = Forwarded;
}

function DynamicCustomerGroups(DynamicCustomerGroupID, DynamicCustomerGroupDescription, Query, Priority) {
    this.DynamicCustomerGroupID = DynamicCustomerGroupID;
    this.DynamicCustomerGroupDescription = DynamicCustomerGroupDescription;
    this.Query = Query;
    this.Priority = Priority;
}

function CustomerGroups(CustomerGroupID, CustomerID, CustomerGroupDescription) {
    this.CustomerGroupID = CustomerGroupID;
    this.CustomerID = CustomerID;
    this.CustomerGroupDescription = CustomerGroupDescription;
}

function Customers(CustomerID, Firstname, Lastname, Email, Phone) {
    this.CustomerID = CustomerID;
    this.Firstname = Firstname;
    this.Lastname = Lastname;
    this.Email = Email;
    this.Phone = Phone;
}


// Data Logic Requests
function MessageFoldersResponse(CustomerID, MessageFolderID, MessageFolderDescription, UnreadMessageCount) {
    this.CustomerID = CustomerID;
    this.MessageFolderID = MessageFolderID;
    this.MessageFolderDescription = MessageFolderDescription;
    this.UnreadMessageCount = UnreadMessageCount;
}
// Data Logics

function CreateMessageFolderTypes(db) {
    var messageFolderTypescollection = db.collection("MessageFolderTypes");
    var messagefoldertype1 = new MessageFolderTypes(1, "Inbox");
    var messagefoldertype2 = new MessageFolderTypes(2, "Sent");
    var messagefoldertype3 = new MessageFolderTypes(3, "Drafts");
    var messagefoldertype4 = new MessageFolderTypes(4, "Deleted");
    var messagefoldertype5 = new MessageFolderTypes(5, "Custom");
    messageFolderTypescollection.find().count(function (err, count) {
        if (count == 0) {
            messageFolderTypescollection.insert([messagefoldertype1, messagefoldertype2, messagefoldertype3, messagefoldertype4, messagefoldertype5], function (err, docs) {

            });
        }
    });
}

// Data Logics

function CreateDefaultMessageFolders(db, CustomerID) {
    var collection = db.collection("MessageFolders");
    var messagefoldertype1 = new MessageFolders(CustomerID, 1, "Inbox");
    var messagefoldertype2 = new MessageFolders(CustomerID, 2, "Sent");
    var messagefoldertype3 = new MessageFolders(CustomerID, 3, "Drafts");
    var messagefoldertype4 = new MessageFolders(CustomerID, 4, "Deleted");
    collection.find({ "CustomerID": CustomerID, "MessageFolderID": { $in: [1, 2, 3, 4] } }).count(function (err, docs) {
        if (docs == 0) {
            collection.insert([messagefoldertype1, messagefoldertype2, messagefoldertype3, messagefoldertype4], function (err, docs) {

            });

        }
    });
}
function CreateMessageFolders(db, CustomerID, foldername) {
    var collection = db.collection("MessageFolders");
    var maxFolderID = 1;
    collection.find().sort({ "MessageFolderID": -1 }).limit(1).toArray(function (err, docs) {
        docs.forEach(function (doc) {
            maxFolderID = doc.MessageFolderID + 1;// Increment by one
            var messagefoldertype1 = new MessageFolders(CustomerID, maxFolderID, foldername);
            collection.insert(messagefoldertype1, function (err, docs) {
            });
        });
    });
}
function DeleteMessageFolders(db, CustomerID, messageFolderID) {
    var collection = db.collection("MessageFolders");
    collection.remove({ "CustomerID": CustomerID, "MessageFolderID": messageFolderID }, true, function (err, objects) {
        //console.log("finally deleted.");
    });
}
function UpdateMessageFolders(db, CustomerID, messageFolderID, folderdescription) {
    var collection = db.collection("MessageFolders");
    // If Not Found then dont insert the reocrd.

    collection.find({ "CustomerID": CustomerID, "MessageFolderID": messageFolderID })
    .limit(1).toArray(function (err, docs) {
        docs.forEach(function (doc) {
            var messagefolder = doc;
            messagefolder.MessageFolderDescription = folderdescription;
            collection.update(
                    { "CustomerID": CustomerID, "MessageFolderID": messageFolderID },
                    messagefolder,
                    { upsert: false }
                    , function (err, objects) {
                        //console.log("finally updated.");
                    });
        });
    });

}
function MoveMessageToFolder(db, messageIds, messageFolderID) {
    var collection = db.collection("Messages");
    // If Not Found then dont insert the reocrd.
    //console.log("finally updating." + messageIds + "    --" + messageFolderID);
    collection.find({ "MessageID": { $in: messageIds } })
   .toArray(function (err, docs) {
       docs.forEach(function (doc) {
           var message = doc;
           message.MessageFolderID = messageFolderID;
           collection.update({ "MessageID": message.MessageID }, message, { upsert: false }
                   , function (err, objects) {
                       //console.log("finally updated.");
                   });
       });

   });


}

function ChangeMessageStatues(db, messageIds, messageStatusID) {
    var collection = db.collection("Messages");
    // If Not Found then dont insert the reocrd.
    //console.log("finally updating." + messageIds + "    --" + messageStatusID);
    collection.find({ "MessageID": { $in: messageIds } })
   .toArray(function (err, docs) {
       docs.forEach(function (doc) {
           var message = doc;
           message.MessageStatusID = messageStatusID;
           collection.update({ "MessageID": message.MessageID }, message, { upsert: false }
                   , function (err, objects) {
                       //console.log("finally updated.");
                   });
       });

   });


}
function CreateMessageStatuses(db) {
    var collection = db.collection("MessageStatuses");
    var messagefoldertype1 = new MessageStatuses(1, "Unread", 0, 0, 0);
    var messagefoldertype2 = new MessageStatuses(2, "Read", 1, 0, 0);
    var messagefoldertype3 = new MessageStatuses(3, "Forwarded", 1, 0, 1);
    var messagefoldertype4 = new MessageStatuses(4, "Replied", 1, 1, 0);
    collection.find().count(function (err, count) {
        if (count == 0) {
            collection.insert(messagefoldertype1, function (err, docs) {

            });
            collection.insert(messagefoldertype2, function (err, docs) {

            });
            collection.insert(messagefoldertype3, function (err, docs) {

            });
            collection.insert(messagefoldertype4, function (err, docs) {

            });
        }
    });
}

function CreateDynamicCustomerGroups(db) {
    var collection = db.collection("DynamicCustomerGroups");
    var messagefoldertype1 = new DynamicCustomerGroups(1, "Downline", "", 1);
    var messagefoldertype2 = new DynamicCustomerGroups(2, "Inactive Downline", "", 3);
    var messagefoldertype3 = new DynamicCustomerGroups(3, "Frontline", "", 4);
    var messagefoldertype4 = new DynamicCustomerGroups(4, "Personally Enrolled", "", 5);
    var messagefoldertype5 = new DynamicCustomerGroups(4, "Active Downline", "", 2);

    collection.find().count(function (err, count) {
        if (count == 0) {
            collection.insert(messagefoldertype1, function (err, docs) {

            });
            collection.insert(messagefoldertype2, function (err, docs) {

            });
            collection.insert(messagefoldertype3, function (err, docs) {

            });
            collection.insert(messagefoldertype4, function (err, docs) {

            });
        }
    });


}

function CreateCustomerRequest(db, customer) {
    var collection = db.collection("Customers");
    if (collection.find({ 'CustomerID': customer.CustomerID }).length == 0) {

        //console.log("No Customer found.");
        //collection.insert(customer, function (err, docs) {
        //   db.close();
        //});
    }
    else {
        //console.log("Customer found.");
    }

}

// 
var Enum = {
    MessageStatuses: { Unread: 1, Read: 2, Forwarded: 3, Replied: 4 },
    MessageFolders: { Inbox: 1, Sent: 2, Drafts: 3, Deleted: 4 }
};

//  CreateNewMessageRequest
function SendNewMessage(db, request, callback) {
    try {
        // Create the sender's SENT message
        var collection = db.collection("Messages");
        var collectionCounter = db.collection("counters");
        //console.log("Connected to db");

        collectionCounter.findAndModify({ _id: "MessageID" }, [], { $inc: { seq: 1 } }, { new: true }, function (err, result) {
            //console.log("Object Found" + result.seq);  // result contains the updated document
            var message = new Messages();
            message.MessageID = result.seq;  // Max Message ID
            message.Subject = request.Subject;
            message.Body = request.Body;
            message.MessageDate = new Date();

            message.CustomerID = request.CustomerID;
            message.MessageStatusID = Enum.MessageStatuses.Read;
            message.MessageFolderID = Enum.MessageFolders.Sent;
            message.From = request.From;
            message.FromCustomerID = request.CustomerID;
            message.To = request.Recipients[0].FirstName + " " + request.Recipients[0].LastName;//"";//request.GetAllRecipientsAsCommaDelimitedString();
            message.ToCustomerID = request.Recipients.id;
            message.Notes = "";
            collection.insert(message, function (err, docs) {
                // Create the individual messages
                if (request.Recipients.length > 0) {
                    request.Recipients.forEach(function (recipient) {
                        // Before we start, determine the subject and body in case we have merge fields

                        collectionCounter.findAndModify({ _id: "MessageID" }, [], { $inc: { seq: 1 } }, { new: true }, function (err1, result1) {
                            var subject = request.Subject;
                            var body = request.Body;

                            // Assemble the message
                            var distributorMessage = new Messages();

                            distributorMessage.MessageID = result1.seq;  // Max Message ID
                            distributorMessage.Subject = subject;
                            distributorMessage.Body = body;
                            distributorMessage.MessageDate = new Date();

                            distributorMessage.CustomerID = recipient.id;
                            distributorMessage.MessageStatusID = Enum.MessageStatuses.Unread;
                            distributorMessage.MessageFolderID = Enum.MessageFolders.Inbox;
                            distributorMessage.From = request.From;
                            distributorMessage.FromCustomerID = request.CustomerID;
                            distributorMessage.To = recipient.name;
                            distributorMessage.ToCustomerID = recipient.id;
                            distributorMessage.Notes = "";
                            // Insert the message finally into the DB
                            collection.insert(distributorMessage, function (err, docs) {
                                //console.log(docs);
                            });
                        });// End of Max Id Found
                    });
                    callback();
                }
                else {
                    callback();
                }
            });
        });
    }
    catch (ex) {
        callback();
    }


};
function SaveDraftMessage(db, request, callback) {
    try {
        // Create the sender's SENT message
        var collection = db.collection("Messages");
        var collectionCounter = db.collection("counters");


        collectionCounter.findAndModify({ _id: "MessageID" }, [], { $inc: { seq: 1 } }, { new: true }, function (err, result) {
            //console.log("Object Found" + result.seq);  // result contains the updated document
            var message = new Messages();
            message.MessageID = result.seq;  // Max Message ID
            message.Subject = request.Subject;
            message.Body = request.Body;
            message.MessageDate = new Date();

            message.CustomerID = request.CustomerID;
            message.MessageStatusID = Enum.MessageStatuses.Read;
            message.MessageFolderID = Enum.MessageFolders.Drafts;
            message.From = "Me";
            message.FromCustomerID = request.CustomerID;
            message.To = "";//request.GetAllRecipientsAsCommaDelimitedString();
            message.ToCustomerID = 0;
            message.Notes = "";

            collection.insert(message, function (err, docs) {
                callback();
            });
        });
    }
    catch (ex) {
        callback();
    }


};
function SendNewMessage11(db, request) {

    try {
        // Create the sender's SENT message
        var collection = db.collection("Messages");
        var collectionCounter = db.collection("counters");
        collectionCounter.update({ _id: "MessageID" }, { $inc: { seq: 1 } }, { upsert: false }
        , function (err, objects) {
            if (objects != null) {
                //console.log(objects);
            }
        });
        var message = new Messages();
        message.MessageID = getNextSequence("MessageID");
        message.Subject = request.Subject;
        message.Body = request.Body;
        message.MessageDate = new Date();

        message.CustomerID = request.CustomerID;
        message.MessageStatusID = Enum.MessageStatuses.Read;
        message.MessageFolderID = Enum.MessageFolders.Sent;
        message.From = "Me";
        message.FromCustomerID = request.CustomerID;
        message.To = "";//request.GetAllRecipientsAsCommaDelimitedString();
        message.ToCustomerID = 0;
        message.Notes = "";



        collection.insert(message, function (err, docs) {
            //console.log(docs);


            // Determine if we have any merge fields, and if so, get the data we will need to replace the merge fields.
            // We're just combining the subject and body so we can compare them both at the same time.
            //var hasMergeFields = HasMergeFields(request.Subject + " | " + request.Body);
            //var mergeFieldData = new List<MessageMergeFieldData>();
            //if (hasMergeFields)
            //{
            //    mergeFieldData = FetchMergeFieldData(request);
            //}



            // Create the individual messages
            request.DistributorRecipients.forEach(function (recipient) {
                // Before we start, determine the subject and body in case we have merge fields
                var subject = request.Subject;
                var body = request.Body;

                //if (hasMergeFields)
                //{
                //    var data = mergeFieldData.Where(c => c.CustomerID == recipient.id).FirstOrDefault();
                //    if (data != null)
                //    {
                //        subject = ProcessMergeFields(request.Subject, data);
                //        body = ProcessMergeFields(request.Body, data);
                //    }
                //}


                // Assemble the message
                var distributorMessage = new Messages();

                distributorMessage.MessageID = getNextSequence("MessageID");
                distributorMessage.Subject = subject;
                distributorMessage.Body = body;
                distributorMessage.MessageDate = new Date();

                distributorMessage.CustomerID = recipient.id;
                distributorMessage.MessageStatusID = Enum.MessageStatuses.Unread;
                distributorMessage.MessageFolderID = Enum.MessageFolders.Inbox;
                distributorMessage.From = request.From;
                distributorMessage.FromCustomerID = request.CustomerID;
                distributorMessage.To = recipient.name;
                distributorMessage.ToCustomerID = recipient.id;
                distributorMessage.Notes = "";
                // Insert the message finally into the DB
                collection.insert(distributorMessage, function (err, docs) {
                    //console.log(docs);
                });
            });
        });
        //// If we started from a draft, delete the draft
        //if (request.DraftMessageID != null)
        //{
        //    DeleteMessage(request.CustomerID, (Guid)request.DraftMessageID);
        //}
    }
    catch (ex) {
        //console.log(ex);
        throw ex;
    }

}
function GetMaxMessageID(db) {
    try {
        var maxMessageID = 1;
        var collection = db.collection("Messages");
        collection.find().sort({ "MessageID": -1 }).limit(1).toArray(function (err, docs) {
            if (docs.count > 0) {
                //console.log("Greater then 1");
                docs.forEach(function (doc) {
                    maxMessageID = doc.MessageID + 1;
                    //console.log("Message FolderID" + maxMessageID);
                    return maxMessageID;
                });
            }
            else {
                //console.log("Less then 1");
                //console.log("Message FolderID" + maxMessageID);
                return maxMessageID;
            }

        });
    }
    catch (ex) {
        //console.log(ex);
    }
}
function getNextSequence(name, db) {
    try {
        var NextSequenceNumber = 12;
        if (db != null && db != undefined) {
            //console.log("DB is conntected");
            var collection = db.collection("counters");
            collection.find({ '_id': name }).count(function (err, count) {
                console.log("DB is conntected1");
                if (count == 0) {
                    //console.log("DB is conntected2");
                    collection.insert({
                        _id: name,
                        seq: 0
                    }, function () {
                        //console.log("here");
                        collection.findAndModify(
                                {
                                    query: { _id: name },
                                    update: { $inc: { seq: 1 } },
                                    new: true
                                }
                         ).toArray(function (err, docs) {
                             if (docs.count > 0) {
                                 docs.forEach(function (ret) {
                                     return ret.seq;
                                 });


                             }
                         });
                    });
                }
                else {
                    //console.log("DB is conntected3");
                    NextSequenceNumber = 1;
                    //console.log("DB is conntected4");
                }
                //console.log("DB is conntected5");

            });
            //console.log("DB is conntected6");
        }
        else {
            //console.log("DB is not conntected");
            NextSequenceNumber = 1;
        }
        return NextSequenceNumber;
    }
    catch (ex) {
        //console.log("Error" + ex);
        return 1;
    }
}
function InstallDBStructure(db) {

    if (db != null && db != undefined) {

        var collectionCounter = db.collection("counters");
        collectionCounter.find().count(function (err, count) {
            if (count == 0) {
                collectionCounter.insert({
                    _id: "MessageID",
                    seq: 0
                }, function () {

                });
            }
        });
        CreateDynamicCustomerGroups(db);
        CreateMessageFolderTypes(db);
        CreateMessageStatuses(db);

    }
}