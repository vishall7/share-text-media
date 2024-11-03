class ApiError extends Error {
    constructor(statusCode = 404, message = "somthing went wrong"){
        super(message);
        this.statusCode = statusCode;      
    }
}

export default ApiError;