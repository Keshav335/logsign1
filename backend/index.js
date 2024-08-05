const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const FormDataModel = require('./models/FormData');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/LogSign1');

// Register route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await FormDataModel.findOne({ email: email });
        if (existingUser) {
            return res.json("Already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new FormDataModel({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();

        // Remove password from the response object
        const userResponse = {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email
        };

        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




// Login route=================================
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await FormDataModel.findOne({ email: email });
        if (!user) {
            return res.json("No records found!");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.json("Success");
        } else {
            res.json("Wrong password");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log("Server listening on http://127.0.0.1:3001");
});
