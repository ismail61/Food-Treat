const {Schema,model} = require('mongoose')
const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        default : ''
    },
    address : {
        type : String,
        default : ''
    },
    role : {
        type : String,
        default : 'customer'
    }
},{
    timestamps : true
})

module.exports = model('User',userSchema)