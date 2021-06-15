


const Order = require('../../../models/order')
function statusController(){
    return {
        update(req,res){
            const {orderId,status} = req.body
            Order.updateOne({
                _id:orderId
            },{
                status
            }).then((err,data)=>{

                //Event Emitter
                const eventEmitter = req.app.set('eventEmitter')
                //send toast  by admin
                eventEmitter.emit('orderUpdated',{
                    id : orderId,
                    status : status
                })
                return res.redirect('/admin/orders')
            })
        }
    }
}
module.exports = statusController