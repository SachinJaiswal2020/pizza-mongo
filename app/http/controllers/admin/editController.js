const Menu = require('../../../models/menu')

function editController() {

return{
    async show(req, res){
            const {id: id} = req.params
            const pizza = await Menu.findById({_id: id})
            return res.render('admin/editpizza', {pizza : pizza})     
        },


async update (req, res) {

    const {id: id} = req.params
    const { price, size } = req.body

    //VALIDATING REQUESTS
            if(!price || !size){
                req.flash('error', 'All fields are required')
                return res.redirect(`/admin/editpizza/${id}`)
            }

          const menu = {
            price: price,
            size: size
          }

    await Menu.findByIdAndUpdate({_id: id}, menu)
      .then(menu => {
        return res.redirect('/')
      })
      
      .catch(error => {
        req.flash('error', 'Error updating database')
        return res.redirect('/')
      })
},

        async delete(req, res){
            const {id: id} = req.params
            const food = await Menu.findOneAndDelete({_id: id}).then(() =>{
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/')
            })
        },
    }
}

module.exports = editController