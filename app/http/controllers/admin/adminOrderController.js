const Item = require('../../../models/item')
const Order = require('../../../models/order')
function adminOrderController(){
    return {
        newProductCreate(req,res){
            return res.render('admin/product')
        },
        async showProducts(req,res){
            await Item.find({
                adminId : req.user._id
            },null,{
                sort : {
                    'createdAt' : -1
                }
            },(err,product)=>{
                if(err){
                    req.flash('error','Something went wrong')
                    return res.render('admin/orders')
                }else{
                    return res.render('admin/products',{product})
                }
            })
            
        },
        aProductCreate(req,res){
            //const adminId = document.querySelector('#adminId').nodeValue
            const {adminId,name,size,price,image} = req.body
            const item = new Item({
                adminId:adminId,
                name:name,
                size:size,
                price:price,
                image:image
            })
            item.save().then((result)=>{
                //console.log(result)
      
                req.flash('success','Inserted product successful')
                return res.redirect('/admin/products')

            }).catch(err=>{
                //console.log(err)
                req.flash('error','Something went wrong to insert a product')
                return res.redirect('/admin/product')
            })
            
        },
        orders(req,res){

            Order.find({
                status : {
                    $ne : 'completed'
                }
            },null,{
                sort : {
                    'createdAt' : -1
                }
            }).populate('customerId','-password').exec((err,order)=>{
                //console.log(order)
                //check if ajax call found
                if(req.xhr){
                    return res.json(order)
                }
                return res.render('admin/orders')
            })
        },
        updateProduct(req,res){
            const {productId,image,name,size,price } = req.body      
            if(!image){
                Item.findOneAndUpdate({
                    _id : productId
                },{
                    $set : {
                        name:name,
                        price:price,
                        size:size
                    }
                }).then(()=>{
                    res.redirect('/admin/products')
                })
            }else{
                Item.findOneAndUpdate({
                    _id : productId
                },{
                    $set : {
                        image : image,
                        name:name,
                        price:price,
                        size:size
                    }
                }).then(()=>{
                    res.redirect('/admin/products')
                })
            }            
        },
        profile(req,res){
            res.render('admin/profile')
        }
    }
}

module.exports = adminOrderController