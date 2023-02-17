
const {Schema, model}= require('mongoose');

const postSchema= Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    image: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

postSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

postSchema.set('toJSON', {
    virtuals: true
})

module.exports= model("Post", postSchema);