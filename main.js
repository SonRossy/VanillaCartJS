'use strict';

//get all the button
const addToCardButtonsDOM = document.querySelectorAll('[data-action="ADD_TO_CART"]');
const cartDOM= document.querySelector(".cart");
let cart=[];

//let's check if local storage has something in it
if(JSON.parse(localStorage.getItem('cart'))!==null){
    //then we assign our cart to it
    cart=JSON.parse(localStorage.getItem('cart'))
}

//lets fill the cart in case it is not empty
if(cart.length>0){
    cart.forEach(cartItem=>{
        const product=cartItem;
        cartDOM.insertAdjacentHTML("beforeend",`
                <div class="cart__item">
                <img class="cart__item__image" src="${product.image}" alt="${product.name}">
                <h3 class="cart__item__name">${product.name}</h3>
                <h3 class="cart__item__price">${product.price}</h3>
                <button class="btn btn--primary btn--small${(product.quantity===1 ? ' btn-danger':'' )} " data-action="DECREASE_ITEM">&minus;</button>
                <h3 class="cart_item_quantity">${product.quantity}</h3>
                <button class="btn btn--primary btn--small" data-action="INCREASE_ITEM">&plus;</button>
                <button class="btn btn--danger btn--small" data-action="REMOVE_ITEM">&times;</button>
                </div>`);

        addToCardButtonsDOM.forEach(addToCardButtonDOM=>{
            const productDOM=addToCardButtonDOM.parentNode;

            if(productDOM.querySelector('.product__name').innerHTML===product.name){
                addToCardButtonDOM.disabled=true;
                addToCardButtonDOM.innerHTML="In Cart";

                //getting all items in the cart
                const cartItemsDOM=cartDOM.querySelectorAll(".cart__item");
                //use a for each loop to iterate through the item
                cartItemsDOM.forEach(cartItemDom=>{//adding to cart--------------------------------
                    //check to see if product is already in the cart before we can add to the quantity
                    if(cartItemDom.querySelector(".cart__item__name").innerText===product.name){
                        //then we add event listener
                        cartItemDom.querySelector('[data-action="INCREASE_ITEM"]').addEventListener('click', ()=>{
                            cart.forEach(cartItem=>{
                                if(cartItem.name === product.name){
                                    cartItem.quantity++;
                                    cartItemDom.querySelector('.cart_item_quantity').innerText = cartItem.quantity;
                                    cartItemDom.querySelector('[data-action="DECREASE_ITEM"]').classList.remove("btn--danger");
                                    localStorage.setItem('cart',JSON.stringify(cart));
                                }
                            });

                        });
                        //decrease from the cart----------------------------------------------------
                        cartItemDom.querySelector('[data-action="DECREASE_ITEM"]').addEventListener('click', ()=>{
                            cart.forEach(cartItem=>{
                                if(cartItem.name === product.name){
                                    if(cartItem.quantity>1){
                                        cartItem.quantity--;
                                        cartItemDom.querySelector('.cart_item_quantity').innerText = cartItem.quantity;
                                        localStorage.setItem('cart',JSON.stringify(cart));
                                    }
                                    else
                                    {
                                        cartItemDom.classList.add('cart__item--removed');//adding a class to the this element
                                        setTimeout(()=>cartItemDom.remove(),300);
                                        cart=cart.filter(cartItem=>cartItem.name!==product.name)//will return everything that not equal to product name
                                        localStorage.setItem('cart',JSON.stringify(cart));
                                        addToCardButtonDOM.innerText='Add To Cart';
                                        addToCardButtonDOM.disabled=false;
                                    }
                                    if(cartItem.quantity===1){
                                        cartItemDom.querySelector('[data-action="DECREASE_ITEM"]').classList.add("btn--danger");
                                    }

                                }
                            });

                        });

                        //remove from the cart----------------------------------------------------
                        cartItemDom.querySelector('[data-action="REMOVE_ITEM"]').addEventListener('click', ()=>{
                            cart.forEach(cartItem=>{
                                if(cartItem.name === product.name){

                                    cartItemDom.classList.add('cart__item--removed');//adding a class to the this element
                                    setTimeout(()=>cartItemDom.remove(),300);
                                    cart=cart.filter(cartItem=>cartItem.name!==product.name)//will return everything that not equal to product name
                                    localStorage.setItem('cart',JSON.stringify(cart));
                                    addToCardButtonDOM.innerText='Add To Cart';
                                    addToCardButtonDOM.disabled=false;
                                }

                            });

                        });

                    }
                });
            }

        });

    });
}

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
                <button class="btn btn--primary btn--small btn--danger${(product.quantity===1 ? ' btn-danger':'' )}" data-action="DECREASE_ITEM">&minus;</button>
                <h3 class="cart_item_quantity">${product.quantity}</h3>
                <button class="btn btn--primary btn--small" data-action="INCREASE_ITEM">&plus;</button>
                <button class="btn btn--danger btn--small" data-action="REMOVE_ITEM">&times;</button>
                </div>`)
            //adding product to cart array
            cart.push(product);
            //saving to local storage
            localStorage.setItem('cart',JSON.stringify(cart));

            addToCardButtonDOM.disabled=true;
            addToCardButtonDOM.innerHTML="In Cart";

            //getting all items in the cart
            const cartItemsDOM=cartDOM.querySelectorAll(".cart__item");
            //use a for each loop to iterate through the item
            cartItemsDOM.forEach(cartItemDom=>{//adding to cart--------------------------------
               //check to see if product is already in the cart before we can add to the quantity
                if(cartItemDom.querySelector(".cart__item__name").innerText===product.name){
                    //then we add event listener
                    cartItemDom.querySelector('[data-action="INCREASE_ITEM"]').addEventListener('click', ()=>{
                        cart.forEach(cartItem=>{
                            if(cartItem.name === product.name){
                                cartItem.quantity++;
                                cartItemDom.querySelector('.cart_item_quantity').innerText = cartItem.quantity;
                                cartItemDom.querySelector('[data-action="DECREASE_ITEM"]').classList.remove("btn--danger");
                                localStorage.setItem('cart',JSON.stringify(cart));
                            }
                        });

                    });
                    //decrease from the cart----------------------------------------------------
                    cartItemDom.querySelector('[data-action="DECREASE_ITEM"]').addEventListener('click', ()=>{
                        cart.forEach(cartItem=>{
                            if(cartItem.name === product.name){
                                if(cartItem.quantity>1){
                                    cartItem.quantity--;
                                    cartItemDom.querySelector('.cart_item_quantity').innerText = cartItem.quantity;
                                    localStorage.setItem('cart',JSON.stringify(cart));
                                }
                                else
                                {
                                    cartItemDom.classList.add('cart__item--removed');//adding a class to the this element
                                    setTimeout(()=>cartItemDom.remove(),300);
                                    cart=cart.filter(cartItem=>cartItem.name!==product.name)//will return everything that not equal to product name
                                    localStorage.setItem('cart',JSON.stringify(cart));
                                    addToCardButtonDOM.innerText='Add To Cart';
                                    addToCardButtonDOM.disabled=false;
                                }
                                if(cartItem.quantity===1){
                                    cartItemDom.querySelector('[data-action="DECREASE_ITEM"]').classList.add("btn--danger");
                                }

                            }
                        });

                    });

                    //remove from the cart----------------------------------------------------
                    cartItemDom.querySelector('[data-action="REMOVE_ITEM"]').addEventListener('click', ()=>{
                        cart.forEach(cartItem=>{
                            if(cartItem.name === product.name){

                                    cartItemDom.classList.add('cart__item--removed');//adding a class to the this element
                                    setTimeout(()=>cartItemDom.remove(),300);
                                    cart=cart.filter(cartItem=>cartItem.name!==product.name)//will return everything that not equal to product name
                                    localStorage.setItem('cart',JSON.stringify(cart));
                                    addToCardButtonDOM.innerText='Add To Cart';
                                    addToCardButtonDOM.disabled=false;
                            }

                        });

                    });

                }
            });


        }





    })

})

