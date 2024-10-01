export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
	cart = [
		{
			productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
			//image: "images/products/athletic-cotton-socks-6-pairs.jpg",
			//name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
			//priceCents: 1090,
			quantity: 1
		},	 {
			productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
			/*image: "images/products/intermediate-composite-basketball.jpg",
			name: "Intermediate Size Basketball",
			priceCents: 2095,*/
			quantity: 1
		}];
}

export function saveToStorage() {
	localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
	let matchingItem;
	cart.forEach((cartItem) => {
		if (productId === cartItem.productId) {
			matchingItem = cartItem;
		}
	});
	const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
	const quantity = Number(quantitySelector.value);
	console.log(quantity);
	if (matchingItem) {
		matchingItem.quantity += quantity;
	} else {
		cart.push({
			productId,
			quantity
		});
	}
	saveToStorage();
}


export function removeFromCart(productId) {
	const newCart = [];

	cart.forEach((cartItem) => {
		if (cartItem.productId !== productId) {
			newCart.push(cartItem);
		}
	});

	cart = newCart;

	saveToStorage();
}

export function calculateCartQuantity() {
	let cartQuantity = 0;
	cart.forEach((cartItem) => {
		cartQuantity += cartItem.quantity;
	});
	return cartQuantity;
}

