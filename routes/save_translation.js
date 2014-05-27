var path = require('path');
var fs = require('fs');
exports.save_translation = function (request, response) {
    try {
        fs.writeFile(request.body.fileName, request.body.Data, function (err) {
            if (err) {
		response.send({ Response: err});
            	response.end();
		}else{
            response.send({ Response: 'Data Saved on file' });
            response.end();
		}
        });
        
    }

    catch (ex) {
        console.log("\n Exception #" + ex);
        response.send({ Response: ex });
        response.end();
    }
};
