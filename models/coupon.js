import moment from 'moment';

class Coupon {
    constructor(id, type, title, imageUrl, value, reusable, category, threshold, date, available) {
        this.id = id;
        this.type = type;
        this.title = title
        this.imageUrl = imageUrl;
        this.value = value;
        this.reusable = reusable;
        this.category = category;
        this.threshold = threshold;
        this.date = date;
        this.available = available
    }
}

export default Coupon;