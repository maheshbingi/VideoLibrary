var fs = require('fs');
var db = require('./db-handler');

var DbCreator = function () {};
DbCreator.linesExecuted;

DbCreator.initializeDb = function(callBack) {
	var dbScriptPath = __dirname + '/db.sql';
	this.executeSQLFile(dbScriptPath, callBack);
};

DbCreator.executeSQLFile = function(filePath, callBack) {
	fs.readFile(filePath, 'utf8', function(err, data) {
		if (err) {
			console.log(err);
		} else {
			linesExecuted = 0;
			lines = data.split(";");
			//console.log("Total Lines ======> " + lines.length);
			executeLine(linesExecuted, callBack);
		}
	});
}

/**
 * Executes each sql command sequentially
 */
function executeLine(index, callBack) {
	db.execDbInitSQL(lines[index], function(err, result) {
		//console.log("Line ---> " + lines[index]);
		//console.log("Line index ---> " + linesExecuted);
		linesExecuted++;
		if(linesExecuted < lines.length) {
			executeLine(linesExecuted, callBack);
		} else {
			if(callBack != null) {
				callBack();
			}
		}
	});
}

module.exports = DbCreator;