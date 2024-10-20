import {cart, removeFromCart, calculateCartQuantity, updateQuantity, saveToStorage, updateDeliveryOption } from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from '../../styles/pages/checkout/checkoutHeader.js';

export function renderOrderSummary() {

  let cartSummaryHTML = '';


  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
        Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${matchingProduct.getPrice()}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label  js-quantity-label-${matchingProduct.id} ">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link"
              data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input js-quantity-input-${matchingProduct.id} "data-product-id="${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
    updateCartQuantity();

  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {

      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
        `;

    });
    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);
        renderOrderSummary();
        updateCartQuantity();
        renderPaymentSummary();
      });
    });

  function updateCartQuantity() {
    const cartQuantity = calculateCartQuantity();
    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
  }

  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add('is-editing-quantity');
      });
    });



  document.querySelectorAll(`.js-save-link`)
    .forEach(link => {
      link.addEventListener('click', () => {
        updateEachQuantity(link);
        renderPaymentSummary();
      });

    });


  document.querySelectorAll('.js-quantity-input').forEach((input) => {
    input.addEventListener('keypress', (event) => {
      if (event.key === "Enter") {
        updateEachQuantity(input);
      }
      renderPaymentSummary();
    });

  });

  function updateEachQuantity(element) {
    const productId = element.dataset.productId;

    const container = document.querySelector(`.js-cart-item-container-${productId}`);

    const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

    const newQuantity = Number(quantityInput.value);

    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
    if (newQuantity > 0 && newQuantity < 1000) {
      container.classList.remove('is-editing-quantity');
      updateQuantity(productId, newQuantity);
      quantityLabel.innerHTML = newQuantity;
      updateCartQuantity();
    } else if (newQuantity === 0) {
        removeFromCart(productId);
        renderOrderSummary();
        updateCartQuantity();
        renderPaymentSummary();
    } else {
      alert('Quantity must be at less than 1000!!')
    }

  }

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const { productId, deliveryOptionId } = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}


/*const today = dayjs();
console.log(today);

const fiveAfterToday = today.add('5', 'days');
console.log(fiveAfterToday);

const fiveAfterTodayString = fiveAfterToday.format('D MMMM');
console.log(fiveAfterTodayString);

const oneMonthAfter = today.add('1', 'month');
console.log(oneMonthAfter);
console.log(oneMonthAfter.format('MMMM D'));

const oneMonthBefore = today.subtract('1', 'month');
console.log(oneMonthBefore.format('D MMMM'));

console.log(today.format('dddd'));

function isWeekend(date) {
  const myDate = date.format('dddd');
  if (myDate === 'Saturday' || myDate === 'Sunday') {
    console.log(myDate);
  }
}
export default isWeekend;

*/
