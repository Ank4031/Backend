class ApiError extends Error{
    constructor(statusCode, message="something went wrong",error=[],stack){
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = error;
        this.stack = stack;
    }
}


export {ApiError}