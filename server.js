const express = require('express');
const app = express();
const port = 8383;
const {db} = require('./firebase');

/*The two functions we have are from the specified file*/
const { readDb, writeDb } = require('./dbFunctions');

//Middleware
app.use(express.static('public'));
//Expecting some json
app.use(express.json());

//routes HTTP verbs
app.post('/', async (req, res) => {
    const { id, question, options } = req.body;

    if (!id || !question || options.length === 0 ) {
        res.status(400).send({status: "Error"})
    }

    const docRef = db.collection('polls').doc('polls');

    const response = await docRef.set({
        [id]: {
            question,
            /*Takes the array of different options and returns object fromm accumulator and current value(option), initial 0 for the poll*/
            options: options.reduce((acc, curr) => {
                return {...acc, [curr]: 0 }
            }, {})
        }
        /*updates the items onto document*/
    }, {merge: true});

    /*Do not forget to send status*/
    res.redirect('/' + id);
})

app.get('/ids', async (req, res) => {
    const pollRef = db.collection('polls').doc('polls');
    const data = await pollRef.get();

    const polls = data.data();
    /*Send array of all ids to avoid overlap*/
    res.status(200).send({ids: Object.keys(polls)} );
})

// GET POST PUT DELETE

//For receiving URL for poll
app.get('/:id', (req, res) => {
    /*Destructuring id again*/
    const { id } = req.params;
    console.log(id);
    try {
        return res.status(200).sendFile('poll.html', {root: __dirname + '/public'});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

//For the data
app.get('/data/:id', async (req, res) => {
    const { id } = req.params;

    /*Read data of id*/
    const pollRef = db.collection('polls').doc('polls');
    const data = await pollRef.get();

    const polls = data.data();

    if (!Object.keys(polls).includes(id)) {
        return res.redirect('/');
    }
    res.status(200).send({data: polls[id]});
})

//For the vote, sends and updates the DB
app.post('/vote', async (req, res) => {
    const { id, vote } = req.body;

    const pollRef = db.collection('polls').doc('polls');
    const polls = await pollRef.get();

    const data = polls.data();

    data[id]['options'][vote] += 1;

    const docRef = db.collection('polls').doc('polls');

    const response = await docRef.set({
        ...data
        /*updates the items onto document*/
    }, {merge: true});    res.sendStatus(200);
})

app.listen(port, () => console.log(`Server started on port ${port}`));

