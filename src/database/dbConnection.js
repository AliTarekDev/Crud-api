const mongoose= require('mongoose');
mongoose.set('strictQuery', true);
exports.dbConnection= ()=> {
    return mongoose.connect(process.env.MONGO_STRING).then(()=> {
        console.log("Connected To Database");
    }).catch((err)=> {
        console.log(err);
    })
}