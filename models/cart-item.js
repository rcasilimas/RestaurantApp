class CartItem {
    constructor(cartId, categoryId, quantity, productPrice, productTitle, productImage, sum, option1, option2) {
        this.cartId = cartId;
        this.categoryId = categoryId;
        this.quantity = quantity;
        this.productPrice = productPrice;
        this.productTitle = productTitle;
        this.productImage = productImage;
        this.sum = sum;
        this.option1 = option1;
        this.option2 = option2;
    }
}

export default CartItem;