const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: () => new Date().toLocaleDateString()
    },
    time: {
        type: String,
        default: () => new Date().toLocaleTimeString()
    },
    author: {
        type: ObjectId,
        ref: "UserModel",
        required: true
    }
})
const ActivityModel = mongoose.model('Activity', activitySchema);
module.exports = ActivityModel;