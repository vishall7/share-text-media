const errorHandler = (err, _ , res, next) => {
    if(res.headersSent) {
        next(err)        
        return; 
    }
    res.status(500).json({
        error: err.message,
        errorType: err.errorType,
        code: err.statusCode 
    })
}

export default errorHandler;