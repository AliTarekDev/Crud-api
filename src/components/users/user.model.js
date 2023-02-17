const {Schema, model}= require('mongoose');

let userSchema= new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

userSchema.virtual('id').get(function() {
    return this._id.toHexString()
});

userSchema.set('toJSON', {
    virtuals: true
});


module.exports= model('User', userSchema);