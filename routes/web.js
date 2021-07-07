const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const addController = require('../app/http/controllers/admin/addController')
const editController = require('../app/http/controllers/admin/editController')

//Middlewares
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')

function initRoutes(app) {
    
        app.get('/', homeController().index) 
        app.get('/search', homeController().search) 
        app.get('/searchError', homeController().searchError)
        app.get('/login', guest, authController().login) 
        app.post('/login', authController().postLogin) 
        app.get('/register', guest, authController().register) 
        app.post('/register', authController().postRegister)
        app.post('/logout', authController().logout)  

        app.get('/cart', cartController().index) 
        app.post('/update-cart', cartController().update)
        app.post('/increase-cart', cartController().increase)
        app.post('/decrease-cart', cartController().decrease)
        

        //Customers routes
        app.post('/orders', auth, orderController().store)
        app.get('/customers/orders', auth, orderController().index)
        app.get('/customers/orders/:id', auth, orderController().show)


        //Admin routes
        app.get('/admin/orders', admin, adminOrderController().index)
        app.post('/admin/orders/status', admin, statusController().update)
        app.get('/admin/addpizza', admin, addController().index)
        app.post('/admin/addpizza', admin, addController().add)
        app.get('/admin/editpizza/:id', admin, editController().show)
        app.post('/admin/editpizza/:id', admin, editController().update)
        app.get('/admin/deletepizza/:id', admin, editController().delete)

//(req,res) => {
//     res.render('home')
// })

// app.get('/cart', (req,res) => {
//     res.render('customers/cart')
// })


}

module.exports = initRoutes