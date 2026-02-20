const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/courses', require('./routes/courses'));

app.get('/', (req, res) => {
    res.send('EduCloud API is running');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
