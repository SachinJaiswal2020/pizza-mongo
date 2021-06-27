const Menu = require('../../../models/menu')

function addController() {

    return{
        add(req,res) {
            res.render('admin/addpizza')
        },
        async postAdd(req, res) {
            const { name, image, price, size } = req.body

            //VALIDATING REQUESTS
            if (!name || !image || !price || !size) {
                req.flash('error', 'All fields are required')
                req.flash('image', image)
                req.flash('price', price)
                return res.redirect('/admin/addpizza')
            }

            Menu.exists({name: name , size: size}, (err, result) => {
                if (result) {
                    req.flash('error', 'Pizza already Exists')
                    req.flash('image', image)
                    req.flash('price', price)
                    return res.redirect('/admin/addpizza')
                }
            })

            //CREATING Menu IN DB
            const menu = await new Menu({
                name, 
                image,
                price, 
                size
            })

            menu.save().then(() => {
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/admin/addpizza')
            })

            // console.log(req.body)
        },
    }
}

module.exports = addController