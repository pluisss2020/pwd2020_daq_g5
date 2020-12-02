const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

process.title = process.argv[2];

require('dotenv').config();

// SETUP EXPRESS
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

// SETUP MONGOOSE
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, (err) => {
    if (err) throw err;
    console.log('MongoDB connected');
});

// ROUTES
const userRouter = require('./routes/user.routes');
const valuesRouter = require('./routes/values.routes');

app.use('/values', valuesRouter);
app.use('/users', userRouter);


app.listen(port, () => console.log('Server running on: ' + port));