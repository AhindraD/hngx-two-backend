require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");

const PersonModel = require("./Models/Person-Schema");

//CONNECTING to MongoDB
const DB_URL = process.env.MONGODB_URL;
const DB_Options = {
    useNewURLParser: true,
    useUnifiedTopology: true
}
mongoose.connect(DB_URL, DB_Options)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("ERROR: ", err))

//MIddleWares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({}));
// Logger to show logs in console 
app.use(morgan("dev"));



//Create Person
app.post('/api', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return response.status(400).send('Input required! - Name');
    }
    const newPerson = new PersonModel({
        name,
        id: new mongoose.Types.ObjectId()
    })
    try {
        const savePerson = await newPerson.save();
        const response = {
            success: true,
            person: savePerson
        }
        res.status(201).json(response);
    } catch (e) {
        res.status(501).json(e.message);
    }
})


//View all persons
app.get('/api',async (req, res) => {
    try {
        const response = await PersonModel.find({});
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json(e);
    }
})

//View One Person
app.get('/api/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await PersonModel.findOne({id});
        if(!response) {
            return res.status(404).json("Person not found");
        }
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json(e.message);
    }
})

//Update One
app.put('/api/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if(!name) {
        return res.status(400).send('Input required! - Name');
    }
    try {
        const response = await PersonModel.findOne({ id });
        if(!response) {
            return res.status(404).json("Person not found");
        }
        await PersonModel.updateOne({ id }, { name });
        res.status(202).json("Person UPDATED with ID: " + id);
    } catch (e) {
        res.status(501).json(e.message);
    }
})

//Delete One
app.delete('/api/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await PersonModel.findOne({ id });
        if(!response) {
            return res.status(404).json("Person not found");
        }
        await PersonModel.deleteOne({ id });
        res.status(202).json("Person DELETED with ID: " + id);
    } catch (e) {
        res.status(501).json(e.message);
    }
})

app.listen(8000, () => {
    console.log('Server listening on port 8000!');
})