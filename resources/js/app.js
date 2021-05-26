import axios from 'axios'
import Noty from 'noty'

let addToCart = document.querySelectorAll('.add-to-class')
let cartCounter = document.querySelector('#cartCounter')
//third
function updateCart(pizza){
    axios.post('/update-cart',pizza).then(res => {
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

addToCart.forEach((btn) => {
    //first
    btn.addEventListener('click',(e) =>{
        // console.log(e)
        //second
        let food = JSON.parse(btn.dataset.pizza)
        // console.log(food)
        //third
        updateCart(food)
        
    })
})