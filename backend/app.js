const express = require('express')
const cors = require('cors');
require('dotenv').config();
const userRouter = require('./app/routes/user.route');
const productRouter = require('./app/routes/product.route');




const app = express();

app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

app.get('/', (req, res) => {
    res.json({message: "Project 28/02/2025"});
});




module.exports = app;