import axios from 'axios'
import Noty from 'noty'
import moment from 'moment'
import {initAdmin} from './admin'
import { initStripe } from './stripe';


let addToCart = document.querySelectorAll('.add-to-cart')
let incrementCart = document.querySelectorAll('.increment')
let decrementCart = document.querySelectorAll('.decrement')
let cartCounter = document.querySelector('#cartCounter')

//third
function updateCart(pizza){
    axios.post('/update-cart', pizza).then(res => {
        // console.log(res)
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar: false,
            layout: 'topRight'
        }).show();
    }).catch(err =>{
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false,
            layout: 'topRight'
        }).show();
    })
}

function increaseCart(pizza){
    axios.post('/increase-cart', pizza).then(res => {
        // console.log(res)
        cartCounter.innerText = res.data.totalQty
        window.location.reload()
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar: false,
            layout: 'topRight'
        }).show();
    }).catch(err =>{
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false,
            layout: 'topRight'
        }).show();
    })
}

function decreaseCart(pizza) {
   axios.post('/decrease-cart', pizza).then(res => {
       cartCounter.innerText = res.data.totalQty
        window.location.reload()
       new Noty({
           type: 'success',
           timeout: 1000,
           text: 'Item removed from cart',
           progressBar: false,
       }).show();
   }).catch(err => {
       new Noty({
           type: 'error',
           timeout: 1000,
           text: 'Something went wrong',
           progressBar: false,
       }).show();
   })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
       let pizza = JSON.parse(btn.dataset.pizza)
       // if data fetched from session , there will be have "item object" => (cart.ejs)
       if (pizza.item) {
           pizza = pizza.item;
       }
       updateCart(pizza)
       })
   })

   incrementCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
       let pizza = JSON.parse(btn.dataset.pizza)
       if (pizza.item) {
           pizza = pizza.item;
       }
       increaseCart(pizza)
       })
   })

   decrementCart.forEach((btn) => {
       btn.addEventListener("click", (e) => {
       let pizza = JSON.parse(btn.dataset.pizza)
       decreaseCart(pizza.item)
   })
})

//Remove alert message after some second
const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}


//Change Order Status
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value: null
// console.log(order)
order = JSON.parse(order)
// console.log(order)
let statuses = document.querySelectorAll('.status_line')
// console.log(statuses)

let time = document.createElement('small')

function updateStatus(order){
    statuses.forEach((status) =>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let stepCompleted = true;
    statuses.forEach((status) =>{
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling)
            {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order);

initStripe()

//Socket
let socket = io()

//Join
if(order){
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname
// console.log(adminAreaPath)
if(adminAreaPath.includes('admin')){
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    // console.log(data)
    updateStatus(updatedOrder)
    new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Order Updated',
            progressBar: false,
            layout: 'topRight'
        }).show();
})