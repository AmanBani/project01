const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'tuf',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Fetch all data
app.get('/data', (req, res) => {
    const sql = "SELECT * FROM data";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Insert new data
app.post('/data', (req, res) => {
    const sql = "INSERT INTO data (`Question`, `Answer`) VALUES (?)";
    const values = [
        req.body.Question,
        req.body.Answer
    ];
    db.query(sql, [values], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});

// Update existing data
app.put('/data/:que', (req, res) => {
    const sql = "UPDATE data SET `Question` = ?, `Answer` = ? WHERE `Question` = ?";

    const que = req.params.que;
    const values = [
        req.body.Question,
        req.body.Answer
    ];

    db.query(sql, [...values, que], (err, result) => {
        if (err) return res.json({ Message: "Error inside Server" });
        return res.json(result);
    });
});

// Delete specific data
app.delete('/data/:que', (req, res) => {
    const sql = "DELETE FROM data WHERE `Question` = ?";

    const que = req.params.que;
    db.query(sql, [que], (err, result) => {
        if (err) return res.json({ Message: "Error inside Server" });
        return res.json(result);
    });
});

app.get('/', (req, res) => {
    return res.json("From Backend");
});

app.listen(8081, () => {
    console.log("Listening on port 8081");
});
