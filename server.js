const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 4000;

// middleware parser for incoming JSON data
app.use(express.json());

// static middleware for CSS, HTML and JS files
app.use(express.static('public'));

// route to return notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

// route to read db.json and return all saved notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, noteData) => {
        if(err) {
            res.status(500).json({msg: 'Cannot read the file}'});
        }
        // Make sure that db.json is not empty to avoid error Unexpected end of JSON input
        if(noteData){
            res.status(200).json(JSON.parse(noteData));
        }
    });
});

// route to return index.html file
// "*" should be in the end of the list of routes with same method
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// route to add note to db.json
app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, noteData) => {
        let newNote = [];
        if(err) {
            res.status(500).json({msg: 'Cannot read the file'});
        }
        // Make sure that db.json is not empty to avoid error Unexpected end of JSON input
        if (noteData) {
            newNote = JSON.parse(noteData);
        }
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

// route to remove the selected note by id
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, notes) => {
        if(err) {
            res.status(500).json({msg: 'Cannot read the file}'});
        }
        // filter out the selected note by id
        const newNotes = JSON.parse(notes).filter(note => note.id !== req.params.id);
   
        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(newNotes), err => {
            if (err) {
                res.status(500).json(err.message);
            }
            res.status(200).end();
        });
    });
});

// Show URL and listening port of the running App
app.listen(PORT, () => {
    console.log(`Note taker is running at http://localhost:${PORT}`);
});