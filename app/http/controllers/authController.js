const newUser = require('../../models/user')
const bcrypt = require('bcrypt')
const validator = require('validator')
const passport = require('passport')

function authController(){
    return{
        login(req,res){
            res.render('auth/login')
        },
        register(req,res){
            res.render('auth/register')
        },
        async userRegister(req,res){
            const {name,email,password} = req.body
            if(!name || !email || !password){
                //req.flash(key,value)
                req.flash(
                    'error' , 'All fields required'
                )
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            }
            if((name.length<3) || (password.length<=6)){
                if((name.length<3)){
                    req.flash(
                        'error' , 'Name must be grater than 2 characters'
                    )
                }else if((password.length<=6)){
                    req.flash(
                        'error' , 'Password must be grater than 5 characters'
                    )
                }
                
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            }
            if(!validator.isEmail(email)){
                req.flash(
                    'error' , 'Invalid Email format'
                )
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            }
            newUser.exists({
                email : email
            },(err,result)=>{
                if(result){
                    req.flash(
                        'error' , 'Email already exists'
                    )
                    req.flash('name',name)
                    req.flash('email',email)
                    return res.redirect('/register')
                }
            })
            const hashPass = await bcrypt.hash(password,10)
            const user = new newUser({
                name : name,
                email : email,
                password : hashPass
            })
            user.save().then((user)=>{
                return res.redirect('/login')
            }).catch((err)=>{
                req.flash(
                    'error' , 'Something went wrong'
                )
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            })
        },
        loginUser(req,res,next){
            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('error',info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error',info.message)
                    return res.redirect('/login')
                }
                req.logIn(user,(err)=>{
                    if(err){
                        req.flash('error',info.message)
                        return next(err)
                    }
                    req.user.role ==='admin'? res.redirect('/admin/orders') :  res.redirect('/customers/orders')
                    
                })
            })(req,res,next)
        },
        logout(req,res){
            req.logout()
            return res.redirect('/')
        },
        update(req,res){
            //const {newPhone,newAddress} = req.body
            const phone = !req.user.phone ? req.body.phone : req.user.phone
            const address = !req.user.address ? req.body.address : req.user.address
            newUser.updateOne({
                _id : req.user._id
            },{
                phone : phone,
                address : address
            },function (err, docs) { 
                if (err){ 
                    return res.redirect('/cart')
                } 
                
            })

        }
    }
}
module.exports = authController