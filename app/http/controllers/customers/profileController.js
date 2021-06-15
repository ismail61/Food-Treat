const UpdateProfile = require('./profile/updateProfile')


function profileController(){
    return {
        profile(req,res){
            res.render('customers/profile')
        },
        updateInfo(req,res){
            const { name,address,phone } = req.body
            UpdateProfile().updateInfo(req,res,name,address,phone)
        },
        updatePassword(req,res){
            const { oldPassword,password } = req.body           
            UpdateProfile().updatePass(req,res,oldPassword,password)
        }
    }    
}
module.exports = profileController