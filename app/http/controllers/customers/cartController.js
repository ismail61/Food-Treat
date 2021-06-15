function cartController(){
    return{
        //object
        cart(req,res){
            res.render('customers/cart')
        },
        update(req,res){

            if(!req.session.cart){
                req.session.cart = {
                    items :{},
                    totalQuantity : 0,
                    totalPrice : 0
                }
            }

            let cart = req.session.cart
            if(!cart.items[req.body._id]){
                cart.items[req.body._id] = {
                    itemDetails : {
                        item : req.body,
                        Qty : 1
                    }                    
                }
                cart.totalQuantity = cart.totalQuantity + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }else{
                cart.items[req.body._id].itemDetails.Qty = cart.items[req.body._id].itemDetails.Qty + 1
                cart.totalQuantity = cart.totalQuantity + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            return res.json({
                totalQty : req.session.cart.totalQuantity
            })
        }
    }
}
module.exports = cartController