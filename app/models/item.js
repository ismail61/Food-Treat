const {Schema,model} = require('mongoose')

const itemSchema = new Schema({
    adminId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    name : {
        type : String,
        required:true
    },
    
    size : {
        type : String,
        required:true
    },
    price : {
        type : Number,
        required:true
    },
    image : {
        type : String,
        required:true
    }
    
},{
    timestamps : true
})

module.exports = model('item',itemSchema)