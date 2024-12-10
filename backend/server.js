const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/car_rental', {
}).then(() => console.log('Database connected')).catch(err => console.error(err));

// API Routes
app.use('/api', routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


