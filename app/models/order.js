const {Schema,model} = require('mongoose')

const orderSchema = new Schema({
    customerId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    items : {
        type : Object,
        required : true
    },
    paymentType :{
        type : String,
        default : 'COD'
    },
    status : {
        type : String,
        default : 'Placed'
    }

},{
    timestamps : true
})

module.exports = model('Order',orderSchema)