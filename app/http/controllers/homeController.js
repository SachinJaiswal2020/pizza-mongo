const Menu = require('../../models/menu')

//FACTORY FUNCTION USED TO CREATE OBJECT
function homeController() {
    return{
        async index(req,res) {
            const pizzas = await Menu.find()
                // console.log(pizzas)
                return res.render('home', {pizzas: pizzas})
        },

        searchError(req,res) {
                return res.render('errors/searchError')
        },

        async search(req,res){  
            const searching =  req.query.search
            // console.log(searching)
            Menu.find({name:{'$regex': searching, $options:'i'}},(err,data)=>{  
                    if(err){  
                    console.log(err); 
                    return res.render('errors/searchError');  
                    }else{  
                    return res.render('customers/search',{pizza:data});  
                    // console.log(pizza)
                    }
                })  
            }
    }
}

module.exports = homeController