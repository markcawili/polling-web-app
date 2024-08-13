const express = require('express');
const app = express();
const port = 8383;

/*The two functions we have are from the specified file*/
const { readDb, writeDb } = require('./dbFunctions');

//Middleware
app.use(express.static('public'));
//Expecting some json
app.use(express.json());

//routes HTTP verbs
app.post('/', function (req, res) {
    const { id, question, options } = req.body;

    if (!id || !question || options.length === 0 ) {
        res.status(400).send({status: "Error"})
    }

    console.log(id, question, options);
    const currentPolls = readDb();
    /*Rewrite DB to include what is in there already and then add the new items*/
    writeDb({
        ...currentPolls,
        [id]: {
            question,
            /*Takes the array of different options and returns object fromm accumulator and current value(option), initial 0 for the poll*/
            options: options.reduce((acc, curr) => {
                return {...acc, [curr]: 0 }
            }, {})
        }
    })
    /*Do not forget to send status*/
    res.sendStatus(200);
})

app.get('/ids', (req, res) => {
    const ids = readDb();
    /*Send array of all ids to avoid overlap*/
    res.status(200).send({ids: Object.keys(ids)} );
})

// GET POST PUT DELETE

//For receiving URL for poll
app.get('/:id', (req, res) => {
    /*Destructuring id again*/
    const { id } = req.params;
    console.log(id);
    try {
        return res.status(200).sendFile('poll.html', {root:__dirname + '/public'});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

//For the data
app.get('/data/:id', (req, res) => {
    const { id } = req.params;
    /*Read data of id*/
    const data = readDb()[id];
    res.status(200).send({data});
})

app.listen(port, () => console.log(`Server started on port ${port}`));

