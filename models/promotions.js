const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promotionSchema = new Schema ({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        requiured: true
    },
    price: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: true
    }
})

var Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;