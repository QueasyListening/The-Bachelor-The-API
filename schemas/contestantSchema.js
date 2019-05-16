const mongoose = require('mongoose');
const { Schema } = mongoose;

const constestantSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        age: {
            type: String,
        },
        profession: {
            type: String,
        },
        hometown: {
            type: String,
        }, 
        picURL: {
            type: String,
        },
        weekEliminated: {  // value of 99 indicates contestant has not been eliminated
            type: Number,
            required: true,
            default: 99
        }, 
        weeksDateRecieved: [Number],
        weeksFirstRose: [Number],
        weeksLastRose: [Number],
        weeksKissed: [Number],
    }
)

module.exports = mongoose.model('Contestant', constestantSchema);