import moment from 'moment';

class Order {
    constructor(id, items, totalAmount, date, userId, location, method, address, comments, coupon) {
        this.id = id;
        this.items = items;
        this.totalAmount = totalAmount;
        this.date = date;
        this.userId = userId;
        this.location = location;
        this.method = method;
        this.address = address;
        this.comments = comments;
        this.coupon = coupon;
    }


}

export default Order;