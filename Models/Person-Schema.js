const mongoose = require("mongoose");

const PERSON_SCHEMA = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    }
});

const PersonModel = mongoose.model("Person", PERSON_SCHEMA);
module.exports = PersonModel;