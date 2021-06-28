const Menu = require('../../../models/menu')
const multer = require('multer')
const path = require('path')


function addController() {

        let storage = multer.diskStorage({
            destination: 'public/img/' ,
            filename: (req, file, cb) => {
              const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
              cb(null, uniqueName)
            } 
        })

        let upload = multer({ storage: storage }).single('image')

    return{
        add(req,res) {
            res.render('admin/addpizza')
        },
        postAdd(req, res) {
            upload(req, res, async (err) => {
            // console.log(req.file)
            const { name, price, size } = req.body

            //VALIDATING REQUESTS
            if(!name || !price || !size){
                req.flash('error', 'All fields are required')
                return res.redirect('/admin/addpizza')
            }

            Menu.exists({name: name}, (err, result) =>{
                if(result){
                req.flash('error', 'Name already Exist')
                return res.redirect('/admin/addpizza')
                }
            })

            const menu = new Menu({
                name: name, 
                image: req.file.filename,
                price: price, 
                size: size
            })
            
            //CREATING Menu IN DB
            await menu.save().then(() => {
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/admin/addpizza')
            })

        })
    }
}
}
module.exports = addController