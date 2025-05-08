const express = require('express');
const app = express();
const PORT = 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGODB_URL } = require('./config')

global.__basedir = __dirname;
mongoose.connect(MONGODB_URL);

mongoose.connection.on("connected", ()=> {
    console.log("DB connected");
});

mongoose.connection.on("error",(error) => {
    console.log("DB not connected")
})

app.use(cors());
app.use(express.json());

require('./models/user_model');
require('./models/activity_model');
app.use(require('./routes/user_route'));
app.use(require('./routes/activity_route'));

app.listen(PORT, () => {
    console.log("Server Started");
});