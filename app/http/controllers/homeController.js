const Item = require('../../models/item')

function homeController(){
    return{
        home : async function(req,res){
            const items = await Item.find()
            //console.log(items)
            return res.render('home',{item : items})
            /* Item.find().then(function(items){
                
                res.render('home',{items : items})
            }) */
            
        }
        
    }
}

module.exports = homeController