function authentication(){
    return {
        UserIn(req,res,next){
            if(!req.isAuthenticated()){
                return next()
            }
            res.redirect('/')
        },
        Guest(req,res,next){
            if(req.isAuthenticated()){
                return next()
            }
            res.redirect('/login')
        }
    }
}

module.exports = authentication