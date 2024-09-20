const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 25670; // Change to your desired port
const PASSWORD = 'PASSWORD#'; // Set your desired password

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Serve index.html from the public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.body.password !== PASSWORD) {
        return res.status(403).send('Forbidden: Incorrect Password');
    }

    res.send('File uploaded successfully');
});

// Serve files from the uploads directory (requires password)
app.get('/files', (req, res) => {
    const password = req.query.password; // Get the password from the query parameters
    if (password !== PASSWORD) {
        return res.status(403).send('Forbidden: Incorrect Password');
    }

    const files = fs.readdirSync('./uploads');
    res.json(files);
});

// Serve individual files
app.get('/files/:filename', (req, res) => {
    const password = req.query.password; // Get the password from the query parameters
    if (password !== PASSWORD) {
        return res.status(403).send('Forbidden: Incorrect Password');
    }

    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
