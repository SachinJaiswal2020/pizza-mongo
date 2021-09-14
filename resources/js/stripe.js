import { loadStripe } from '@stripe/stripe-js'
import{ placeOrder } from './apiService'
import { CardWidget } from './CardWidget'

export async function initStripe(){

    const stripe = await loadStripe(
      "pk_test_51JZS1bSB20M2OG7t3jDCs1tplzcscCRlKxt2rczfUh8GySEKi1sdOQB5uLb5eQe6zhVvegQKlljtqR26gkw2YL3r00Ce9N2qrS"
    );
    let card = null;

        const paymentType = document.querySelector('#paymentType');

        if(!paymentType){
            return;
        }

        paymentType.addEventListener('change', (e) =>{
            // console.log(e.target.value)

            if(e.target.value === 'card'){
                //Display Widget
                card = new CardWidget(stripe)
                card.mount()
                // mountWidget();
            }else{
                card.destroy()
            }
        })


        const paymentForm = document.querySelector('#payment-form');
        if(paymentForm){
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            let formData = new FormData(paymentForm);
            let formObject = {}

            for(let [key, value] of formData.entries()){
                formObject[key] = value
                // console.log(key, value)
            }

            if(!card){
                placeOrder(formObject);
                return;
            }

            const token = await card.createToken()
                formObject.stripeToken = token.id
                placeOrder(formObject)
        })
    }
}