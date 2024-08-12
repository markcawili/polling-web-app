const express = require('express');
const app = express();
const port = 8383;

//Middleware
app.use(express.static('public'));

//routes HTTP verbs
app.post('/', function (req, res) {
    res.status(200).send('Hi');
})

// GET POST PUT DELETE

app.listen(port, () => console.log(`Server started on port ${port}`));

