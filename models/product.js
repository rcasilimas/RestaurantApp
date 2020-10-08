class Product {
    constructor(id, available, categoryId, title, imageUrl, description, price) {
        this.id = id;
        this.available = available;
        this.categoryId = categoryId
        this.imageUrl = imageUrl;
        this.title = title;
        this.description = description;
        this.price = price;
    }
}

export default Product;