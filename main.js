'use strict';

//get all the button
const addToCardButtonsDOM = document.querySelectorAll('[data-action="ADD_TO_CART"]');
const cartDOM = document.querySelector(".cart");
let cart = [];

//let's check if local storage has something in it
if (JSON.parse(localStorage.getItem('cart')) !== null) {
    //then we assign our cart to it
    cart = JSON.parse(localStorage.getItem('cart'))
}

//lets fill the cart in case it is not empty
if (cart.length > 0) {
    cart.forEach(cartItem => {
        const product = cartItem;
        insertItemToDOM(product);

        saveCart();

        addToCardButtonsDOM.forEach(addToCardButtonDOM => {
            const productDOM = addToCardButtonDOM.parentNode;

            if (productDOM.querySelector('.product__name').innerHTML === product.name) {
                handleActionButtons(addToCardButtonDOM, product)
            }
        });
    });
}

addToCardButtonsDOM.forEach(addToCardButtonDOM => {
    const productDOM = addToCardButtonDOM.parentNode;
    productDOM.addEventListener('click', () => {
        const product = {
            name: productDOM.querySelector(".product__name").innerHTML,
            image: productDOM.querySelector('.product__image').getAttribute('src'),
            price: productDOM.querySelector(".product__price").innerHTML,
            quantity: 1
        };


        //checking if a product was already in the cart before we add
        const isIncart = (cart.filter(cartItem => (cartItem.name === product.name)).length > 0);
        if (!isIncart) {
            insertItemToDOM(product);
            //adding product to cart array
            cart.push(product);
            //saving to local storage
            saveCart();
            handleActionButtons(addToCardButtonDOM, product)
        }

    })

})

function insertItemToDOM(product) {
    cartDOM.insertAdjacentHTML("beforeend", `
                <div class="cart__item">
                <img class="cart__item__image" src="${product.image}" alt="${product.name}">
                <h3 class="cart__item__name">${product.name}</h3>
                <h3 class="cart__item__price">${product.price}</h3>
                <button class="btn btn--primary btn--small${(product.quantity === 1 ? ' btn-danger' : '')} " data-action="DECREASE_ITEM">&minus;</button>
                <h3 class="cart_item_quantity">${product.quantity}</h3>
                <button class="btn btn--primary btn--small" data-action="INCREASE_ITEM">&plus;</button>
                <button class="btn btn--danger btn--small" data-action="REMOVE_ITEM">&times;</button>
                </div>`);

    addCartFooter();

}

function handleActionButtons(addToCardButtonDOM, product) {
    addToCardButtonDOM.disabled = true;
    addToCardButtonDOM.innerHTML = "In Cart";

    //getting all items in the cart
    const cartItemsDOM = cartDOM.querySelectorAll(".cart__item");
    //use a for each loop to iterate through the item
    cartItemsDOM.forEach(cartItemDom => {//adding to cart--------------------------------
        //check to see if product is already in the cart before we can add to the quantity
        if (cartItemDom.querySelector(".cart__item__name").innerText === product.name) {
            //then we add event listener
            cartItemDom.querySelector('[data-action="INCREASE_ITEM"]').addEventListener('click', () => increaseItem(product, cartItemDom));
            //decrease from the cart----------------------------------------------------
            cartItemDom.querySelector('[data-action="DECREASE_ITEM"]').addEventListener('click', () => decreaseItem(product, cartItemDom, addToCardButtonDOM));

            //remove from the cart----------------------------------------------------
            cartItemDom.querySelector('[data-action="REMOVE_ITEM"]').addEventListener('click', () => removeItem(product, cartItemDom, addToCardButtonDOM));

        }
    });
}

function increaseItem(product, cartItemDom) {
    cart.forEach(cartItem => {
        if (cartItem.name === product.name) {
            cartItem.quantity++;
            cartItemDom.querySelector('.cart_item_quantity').innerText = cartItem.quantity;
            cartItemDom.querySelector('[data-action="DECREASE_ITEM"]').classList.remove("btn--danger");
            saveCart();
        }
    });
}

function decreaseItem(product, cartItemDom, addToCardButtonDOM) {
    cart.forEach(cartItem => {
        if (cartItem.name === product.name) {
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
                cartItemDom.querySelector('.cart_item_quantity').innerText = cartItem.quantity;
                saveCart()
            }
            else {
                removeItem(product,cartItemDom, addToCardButtonDOM)
            }
            if (cartItem.quantity === 1) {
                cartItemDom.querySelector('[data-action="DECREASE_ITEM"]').classList.add("btn--danger");
            }

        }
    });
}

function removeItem(product, cartItemDom, addToCardButtonDOM) {

    cartItemDom.classList.add('cart__item--removed');//adding a class to the this element
    setTimeout(() => cartItemDom.remove(), 300);
    cart = cart.filter(cartItem => cartItem.name !== product.name)//will return everything that not equal to product name
    saveCart();
    addToCardButtonDOM.innerText = 'Add To Cart';
    addToCardButtonDOM.disabled = false;

    //this code is removing the cart footer payment if our cart is empty
    if (cart.length<1){
        document.querySelector('.cart-footer').remove();
    }
}

function addCartFooter() {
    if(document.querySelector('.cart-footer')===null){
        //any time someone add something in the card then we also add the buttons for them to pay or clear the card
        cartDOM.insertAdjacentHTML('afterend',`
        <div class="cart-footer">
            <button class="btn btn--danger" data-action="CLEAR_CART"> Clear cart</button>
            <button class="btn btn--primary" data-action="CHECKOUTT"> Pay</button>
        </div>
    `);
        document.querySelector('[data-action="CLEAR_CART"]').addEventListener('click',()=> clearCart())
        document.querySelector('[data-action="CHECKOUTT"]').addEventListener('click',()=> checkout())
    }


}

function clearCart() {
    cartDOM.querySelectorAll('.cart__item').forEach(cartItemDOM=>{
        cartItemDOM.classList.add('cart__item--removed');//adding a class to the this element
        setTimeout(() => cartItemDOM.remove(), 300);
    });

    localStorage.removeItem('cart');
    document.querySelector('.cart-footer').remove();
    cart=[];

    addToCardButtonsDOM.forEach(addToCardButtonDOM=>{
        addToCardButtonDOM.innerText = 'Add To Cart';
        addToCardButtonDOM.disabled = false;
    })

}

function checkout() {
    let paypalForm=`
   <form id="paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post">
        <input type="hidden" name="cmd" value="_cart">
        <input type="hidden" name="upload" value="1">
        <input type="hidden" name="business" value="adrian@webdev.tube">
        `

    cart.forEach((cartItem,index)=>{
        ++index;
        paypalForm+=`
        <input type="hidden" name="item_name_${index}" value="${cartItem.name}">
        <input type="hidden" name="quantity_${index}" value="${cartItem.quantity}">
        <input type="hidden" name="amount_${index}" value="${cartItem.price}">
        `
    });
       /* <input type="hidden" name="business" value="seller@dezignerfotos.com">
        <input type="hidden" name="item_name_1" value="Item Name 1">
        <input type="hidden" name="amount_1" value="1.00">
        <input type="hidden" name="shipping_1" value="1.75">
        <input type="hidden" name="item_name_2" value="Item Name 2">
        <input type="hidden" name="amount_2" value="2.00">
        <input type="hidden" name="shipping_2" value="2.50">
        <input type="submit" value="PayPal">*/
       paypalForm+=`
        <input type="submit" value="PayPal">
    </form>
    <div class="overlay"></div>`;
       document.querySelector('body').insertAdjacentHTML('beforeend',paypalForm);
       document.getElementById('paypal-form').submit();
}

function cardTotal() {
    let total=0;
    cart.forEach(cartItem=>total+=(cartItem.quantity*cartItem.price));
    document.querySelector('[data-action="CHECKOUTT"]').innerHTML=`Pay $ ${total}`
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    cardTotal();
}


















