const fsPromises = require('fs').promises;

// const errorHandler = (err, req, res, next) => {
//     var statusCode = err.statusCode || 500;
//    // logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
//     //console.error(err);
    
//     res.status(statusCode).send(err.message);
// next();
// }
async function errorHandler(err, req, res, next){
    var statusCode = err.statusCode || 500;
    const logMsg = `${new Date()} - ${req.method} - ${req.url} - ${statusCode} - ${err.message} \n`;
    await fsPromises.appendFile('errorLogger.log', logMsg);
    res.status(statusCode).send(err.message);
    next();
}
module.exports = errorHandler;