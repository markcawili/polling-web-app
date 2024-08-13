const express = require('express');
const app = express();
const port = 8383;

//Middleware
app.use(express.static('public'));
//Expecting some json
app.use(express.json());

//routes HTTP verbs
app.post('/', function (req, res) {
    const { id, question, options } = req.body;
    console.log(id, question, options);
    /*Do not forget to send status*/
    res.sendStatus(200);
})

// GET POST PUT DELETE

app.listen(port, () => console.log(`Server started on port ${port}`));

