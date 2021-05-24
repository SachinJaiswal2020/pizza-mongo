const Menu = require('../../models/menu')

//FACTORY FUNCTION USED TO CREATE OBJECT
function homeController() {
    return{
        async index(req,res) {
            const pizzas = await Menu.find()
                // console.log(pizzas)
                return res.render('home', {pizzas: pizzas})
        }
    }
}

module.exports = homeController