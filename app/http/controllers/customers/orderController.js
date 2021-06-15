const Order = require('../../../models/order')
const moment = require('moment')


function orderController(){
    return {
        store(req,res){
            //console.log(req.user)
            const order = new Order({
                customerId : req.user._id,
                items : req.session.cart.items
            }) 
            order.save().then(result=>{
                
                Order.populate(result,{
                    path : 'customerId'
                },(err,newOrder)=>{
                    req.flash('success','Order placed successful')
                    delete req.session.cart
                    //send toast by user
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced',newOrder)
    
                    return res.redirect('customers/orders')
                })
               
            }).catch(err=>{
                req.flash('error','Something went wrong')
                return res.redirect('/cart')
            })
        },

        async showOrders(req,res){
            await Order.find({
                customerId : req.user._id
            },null,{
                sort : {
                    'createdAt' : -1
                }
            },(err,orders)=>{
                if(err){
                    req.flash('error','Something went wrong')
                    return res.redirect('/')
                }
                res.header('Cache-Control','no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')
                return res.render('customers/orders',{orders,user:req.user,moment})
            })
        },
        async showSingleOrder(req,res){
            const order = await Order.findById(req.params.id)
            if(req.user._id.toString() === order.customerId.toString()){
                res.render('customers/aOrder',{order})
            }

        }
    }
}
module.exports = orderController