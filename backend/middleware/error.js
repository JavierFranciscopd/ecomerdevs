const ErrorHandler = require("../utils/errorhander");


module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error"

    // Wrong Mongodb Id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    // Mongoose duplicate key error

    if(err.code === 11000){
        const message = `Duplicado ${Object.keys(err.keyValue)} Ingreso`
        err = new ErrorHandler(message,400);
    }

        // Wrong JWT error
        if(err.name === "JsonWebTokenError"){
            const message = `El token web de Json no es válido, inténtelo de nuevo `;
            err = new ErrorHandler(message,400);
        }

        // JWT EXPIRE error
        if(err.name === "TokenExpiredError"){
            const message = `El token web de Json ha caducado, inténtelo de nuevo `;
            err = new ErrorHandler(message,400);
        }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};