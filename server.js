const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 4000;



app.use(express.json());

//middleware
app.use(express.static('public'));


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

// route to read db.json
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, noteData) => {
        if(err) {
            res.status(500).json({msg: 'Cannot read the file}'});
        }
        res.status(200).json(JSON.parse(noteData));
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, noteData) => {
        if(err) {
            res.status(500).json({msg: 'Cannot read the file'});
        }
        const newNote = JSON.parse(noteData);
        req.body.id = uuidv4();
        newNote.push(req.body);
        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(newNote), err => {
            if (err) {
                res.status(500).json(err.message);
            }
            res.status(200).end();
        });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
});