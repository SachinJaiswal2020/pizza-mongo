const Order = require('../../../models/order')
const order = require("../../../models/order")

function orderController() {
    return {
        index(req, res) {
            //$ne : This query will select all data in the collection where the status value does not equal to 'completed'
            order.find({status: {$ne: 'completed'}}, null, {sort:{'createdAt': -1}}).populate('customerId', '-password').exec((err, orders) =>{
                
                if(req.xhr){
                    return res.json(orders)
                }else{
                return res.render('admin/orders')
                }
            })
        }
    }
}

module.exports = orderController