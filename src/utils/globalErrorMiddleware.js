module.exports= (err,req,res,next)=> {
    err.statusCode= err.statusCode || 500;

    if(process.env.NODE_ENV=== "development") {
        devMode(err,res)
    }else {
        prodMod(err,res)
    }
}


let devMode= (err,res)=> {
    res.status(err.statusCode).json({status: err.statusCode, message: err.message, stack: err.stack})

}


let prodMod= (err,res)=> {
    res.status(err.statusCode).json({status: err.statusCode, message: err.message})

}