function AsyncHandler(fu){
    return async (req,res,next)=>{
        Promise.resolve(fu(req,res,next)).catch(error=>next(error))
    }
}

export {AsyncHandler}