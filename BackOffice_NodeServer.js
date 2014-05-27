var pkgcloud = require('pkgcloud');
var MongoClient = require('mongodb').MongoClient
  , format = require('util').format;
var express = require("express"),
    app = express();                                                                             
var fs = require('fs');
var path = require('path');
var http = require('http');

// tell express to use the bodyParser middleware                                                 
// and set upload directory                                                                      
app.use(express.bodyParser({ keepExtensions: true, uploadDir: "uploads" }));                     
app.engine('jade', require('jade').__express);                                                   
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.JSON = true;
    // Pass to next layer of middleware
    next();
});
var exigoApi = require('./exigo/api/apiRequestHandler')
app.post('/exigoapi',exigoApi.apiRequestHandler);

//Messages Operations
var messages = require('./routes/messages');
var suffix = "/messages/";
//app.get(suffix + '', messages.testconnectivity);
app.get(suffix + 'InstallDB', messages.InstallDB);
app.post(suffix + 'SendMessage', messages.SendMessage);
app.post(suffix + 'GetMessages', messages.GetMessages);
app.post(suffix + 'GetMessageFolders', messages.GetMessageFolders);
app.post(suffix + 'CreateMessageFolder', messages.CreateMessageFolder);
app.post(suffix + 'DeleteMessageFolders', messages.DeleteMessageFolders);
app.post(suffix + 'UpdateMessageFolders', messages.UpdateMessageFolders);
app.post(suffix + 'GetSingleMessage', messages.GetSingleMessage);
app.post(suffix + 'movemessagestofolder', messages.movemessagestofolder);
app.post(suffix + 'getmatchingrecipients', messages.getmatchingrecipients);
app.post(suffix + 'changemessagestatuses', messages.changemessagestatuses);
app.post(suffix + 'SaveDraftMessage', messages.SaveDraftMessage);
//languages
var languages = require('./routes/languages');
app.get('/get-languages', languages.get);
app.post("/add-languages", languages.add);
app.post('/update-languages', languages.update);
app.post("/delete-languages", languages.delete);

//countries
var countries = require('./routes/countries');
app.get('/get-countries', countries.get);
app.post("/add-countries", countries.add);
app.post('/update-countries', countries.update);
app.post("/delete-countries", countries.delete);

//categories
var categories = require('./routes/categories');
app.get('/get-categories', categories.get);
app.post("/add-categories", categories.add);
app.post('/update-categories', categories.update);
app.post("/delete-categories", categories.delete);

//resourrces
var resources = require('./routes/resources');
app.post('/get_resources', resources.get);
app.post('/get_resources_all', resources.getAll);
app.post("/add-resources", resources.add);
app.post('/update_resources', resources.update);
app.post("/delete-resources", resources.delete);

app.get('/updateRecords', resources.updateRecords);

app.post("/upload", resources.upload);

//tags
var tags = require('./routes/tags');
app.get('/get-tags', tags.get);

//tagTypes
var tagTypes = require('./routes/tagTypes');
app.get('/get-tagTypes', tagTypes.get);

//CustomerTypes
var customerTypes = require('./routes/customerTypes');
app.get('/get-customerTypes', customerTypes.get);

//rights
var admin = require('./routes/admin');
app.post('/get-rights', admin.get);

//cms
var cms_content = require('./routes/cms_content');
app.post('/get-cms_content', cms_content.get);
app.post('/add-cms_content', cms_content.add);
app.post('/update-cms_content', cms_content.update);

app.get('/updateRecordsCMS', cms_content.updateRecordsCMS);

// FOR Calendar Module
var events = require('./routes/events');
app.get('/get-events', events.get);
app.post('/events/event-manage', events.add);
app.post('/event-delete', events.delete);
app.post('/events/event-update', events.update);

// FOR Message Group Module
var messagegroups = require('./routes/messagegroups');
app.get('/get_group', messagegroups.get);
app.post('/add_group', messagegroups.add);
app.post('/delete_group', messagegroups.delete);
app.post('/update_group', messagegroups.update);

// FOR Contact -> Activity
var activity = require('./routes/activity');
app.post('/get_activity', activity.get);//Why you set it again get while I already done it with post?
app.post('/add_activity', activity.add);
app.post('/delete_activity', activity.delete);
app.post('/update_activity', activity.update);
app.post('/update_last_activity', activity.updateLastActivity);

// For Language file updation
var save_translation = require('./routes/save_translation');
app.post('/save_translation', save_translation.save_translation);

//For Mail-gun
var mail_gun = require('./routes/mail_gun');
app.post('/forward_mail',express.basicAuth('api', 'test'), mail_gun.get_mail);
app.get('/get_mail', mail_gun.get);

app.listen(3051);

console.log("server is started on http://node01.wsicloud.com:3051 \n");

