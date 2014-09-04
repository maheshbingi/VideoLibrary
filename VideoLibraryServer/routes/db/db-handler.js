// UPDATE mysql.user SET Password=PASSWORD('root') WHERE User='root';
// FLUSH PRIVILEGES;

var mysql = require('mysql');
var databaseConf = {
	host		: 'localhost',
	user		: 'root',
	password	: 'root',
	port		: '3306',
	database	: 'VideoLibrary'
};
var pool =  mysql.createPool(databaseConf);

function executeQuery(query, valueMap, callback) {
	console.log("Inside execSQL --> " + query);
	//console.log(valueMap);
	pool.getConnection(function(err, connection) {
		connection.query( query, valueMap, function(err, result) {
			if((typeof callback !== 'undefined') && (callback !== null)) {
				if(err) {
					console.log(err);
				}
				callback(err, result);
			}
		});
		connection.release();
	});
}

/**
 * Executes SQL statement
 * @param query Query which is to be executed
 * @param callback Callback function
 */
exports.execSQL = function(query, callback) {
	executeQuery(query, null, callback);
};

/**
 * Executes SQL insert statement
 * @param tableName Table name specifying in which table data has to be inserted
 * @param valueMap Map of values which are to be inserted
 * @param callback Callback function
 */
exports.insert = function(tableName, valueMap, callback) {
	var query = 'INSERT INTO ' + tableName + ' SET ? ';
	executeQuery(query, valueMap, callback);
};

/**
 * Executes SQL update statement
 * @param query SQL query
 * @param valueMap Map of values which are to be updated
 * @param callback Callback function
 */
exports.update = function(query, valueMap, callback) {
	executeQuery(query, valueMap, callback);
};

/**
 * Configurations which will be used while initializing database ONLY (As db name is missing)
 */
var initDbConf = {
	host		: 'localhost',
	user		: 'root',
	password	: 'root',
	port		: '3306',
	database	: ''
};
var dbInitPool =  mysql.createPool(initDbConf);

/**
 * Executes db initialize queries
 */
exports.execDbInitSQL = function(query, callback) {
	dbInitPool.getConnection(function(err, connection) {
		connection.query( query, null, function(err, result) {
			if((typeof callback !== 'undefined') && (callback !== null)) {
				callback(err, result);
			}
		});
		connection.release();
	});
};