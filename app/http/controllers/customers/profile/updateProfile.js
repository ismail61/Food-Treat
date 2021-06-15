const User = require('../../../../models/user')
const bcrypt = require('bcrypt')
function updateProfile(){
    return {
        updateInfo(req,res,name,address,phone){
            const customerId = req.user._id
            User.findOneAndUpdate({
                _id : customerId
            },{
                $set : {
                    name : name,
                    address : address,
                    phone : phone
                }
            },(err,data)=>{
                if(err){
                    req.flash('err','Something went Wrong')
                    return res.redirect('/')
                }
                return res.redirect('/customers/profile')
            })
        },
        updatePass(req,res,oldPassword,password){
            if(!oldPassword || !password){
                req.flash('error','All fields are required')
                return res.redirect('/customers/profile')
            }else{
                bcrypt.compare(oldPassword,req.user.password,async (err,match)=>{
                    if(match){
                        const hashPass = await bcrypt.hash(password,10)
                        User.findOneAndUpdate({
                            _id : req.user._id
                        },{
                            $set : {
                                password : hashPass
                            }
                        },(err,result)=>{
                            if(err){
                                req.flash('error','Something went Wrong')
                                
                            }
                            req.logout()
                            return res.redirect('/login')
                            //return res.redirect('/customers/profile')
                        })
                    }
                    if(err) {
                        req.flash('error','Something went Wrong')
                        return res.redirect('/customers/profile')
                    }
                    if(!match){
                        req.flash('error',"Password Doesn't Match")
                        return res.redirect('/customers/profile')
                    }
                })
               
            } 
            
            
        }
    }
}
module.exports = updateProfile