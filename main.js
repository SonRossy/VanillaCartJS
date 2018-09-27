'use strict';

//get all the button
const addToCardButtonsDOM = document.querySelectorAll('[data-action="ADD_TO_CART"]');
const cartDOM= document.querySelector(".cart");
let cart=[];

addToCardButtonsDOM.forEach(addToCardButtonDOM=>{
    const productDOM=addToCardButtonDOM.parentNode;
    productDOM.addEventListener('click',()=>{
        const product={
            name:productDOM.querySelector(".product__name").innerHTML,
            image:productDOM.querySelector('.product__image').getAttribute('src'),
            price:productDOM.querySelector(".product__price").innerHTML,
            quantity:1
        };


        //checking if a product was already in the cart before we add
       const isIncart= (cart.filter(cartItem=>(cartItem.name===product.name)).length>0);
        if(!isIncart){
            cartDOM.insertAdjacentHTML("beforeend",`
        <div class="cart__item">
        <img class="cart__item__image" src="${product.image}" alt="${product.name}">
        <h3 class="cart__item__name">${product.name}</h3>
        <h3 class="cart__item__price">${product.price}</h3>
        <button class="btn btn--primary btn--small" data-action="DECREASE_ITEM">&minus;</button>
        <h3 class="cart_item_quantity">${product.quantity}</h3>
        <button class="btn btn--primary btn--small" data-action="INCREASE_ITEM">&plus;</button>
        <button class="btn btn--danger btn--small" data-action="REMOVE_ITEM">&times;</button>
        </div>`)
            //adding product to cart array
            cart.push(product);

            addToCardButtonDOM.innerHTML="In Cart";

            //getting all items in the cart
            const cartItemsDOM=cartDOM.querySelectorAll(".cart__item");
            //use a for each loop to iterate through the item
            cartItemsDOM.forEach(cartItemDom=>{
               //check to see if product is already in the cart before we can add to the quantity
                if(cartItemDom.querySelector(".cart__item__name").innerText===product.name){
                    //then we add event listener
                    cartItemDom.querySelector('[data-action="INCREASE_ITEM"]').addEventListener('click', ()=>{
                        cart.forEach(cartItem=>{
                            if(cartItem.name === product.name){
                                cartItem.quantity++;
                                cartItemDom.querySelector('.cart_item_quantity').innerText = cartItem.quantity;
                            }
                        });

                    });
                }
            });


        }





    })

})

