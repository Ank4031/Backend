class ApiError extends Error{
    constructor(status,message="something is wrong",error=[]){
        super(message)
        this.status = status,
        this.error = error,
        this.success = false,
        this.data = null
    }
}

export {ApiError}