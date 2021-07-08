const Order = require('../../../models/order')
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

function orderController () {
    return{
        store(req,res){
            // console.log(req.body)
            const { phone, address, stripeToken, paymentType } = req.body
            if(!phone || !address)
            {
               return res.status(422).json({ message : 'All fields are required' });
            }
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                totalPrice: req.session.cart.totalPrice,
                phone,
                address
            })
            order.save().then(result => {
                Order.populate(result, { path: 'customerId', select: '-password'  }, (err, placedOrder) => {
                    // req.flash('success', 'Order placed successfully')

                    //Stripe payment
                    if(paymentType === 'card') {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice  * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `Pizza order: ${placedOrder._id}`
                        }).then(() => {
                            placedOrder.paymentStatus = true
                            placedOrder.paymentType = paymentType
                            placedOrder.save().then((ord) => {

                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', ord)
                                delete req.session.cart
                                return res.json({ message : 'Payment successful, Order placed successfully' });
                            }).catch((err) => {
                                console.log(err)
                            })

                        }).catch((err) => {
                            const eventEmitter = req.app.get('eventEmitter')
                            eventEmitter.emit('orderPlaced', result)
                            delete req.session.cart
                            return res.json({ message : 'OrderPlaced but payment failed, You can pay at delivery time' });
                        })
                    } else {
                        const eventEmitter = req.app.get('eventEmitter')
                        eventEmitter.emit('orderPlaced', result)
                        delete req.session.cart
                        return res.json({ message : 'Order placed succesfully' });
                    }
                })
            }).catch(err => {
                return res.status(500).json({ message : 'Something went wrong' });
            })
        },
        async index(req,res){
            const orders = await Order.find({customerId: req.user._id}, null, {sort: { 'createdAt': -1 }})
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            res.render('customers/orders', { orders: orders , moment: moment})
            // console.log(orders)
        },
         async show(req, res){
            const order = await Order.findById(req.params.id)
            //Authorize user
            if(req.user._id.toString() === order.customerId.toString()){
                return res.render('customers/singleOrder', { order })
            }
              return res.render('/')
            
        }
    }
}

module.exports = orderController