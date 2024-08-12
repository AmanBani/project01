const express = require('express');
const { Pool } = require('pg'); // Import the pg Pool
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL client setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tuf',
    password: '', // Your PostgreSQL password
    port: 5432, // Default PostgreSQL port
});

pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Fetch all data
app.get('/data', (req, res) => {
    const sql = "SELECT * FROM data";
    pool.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result.rows);
    });
});

// Insert new data
app.post('/data', (req, res) => {
    const sql = "INSERT INTO data (\"Question\", \"Answer\") VALUES ($1, $2) RETURNING *";
    const values = [
        req.body.Question,
        req.body.Answer
    ];
    pool.query(sql, values, (err, result) => {
        if (err) return res.json(err);
        return res.json(result.rows[0]);
    });
});

// Update existing data
app.put('/data/:que', (req, res) => {
    const sql = "UPDATE data SET \"Question\" = $1, \"Answer\" = $2 WHERE \"Question\" = $3 RETURNING *";

    const que = req.params.que;
    const values = [
        req.body.Question,
        req.body.Answer,
        que
    ];

    pool.query(sql, values, (err, result) => {
        if (err) return res.json({ Message: "Error inside Server" });
        return res.json(result.rows[0]);
    });
});

// Delete specific data
app.delete('/data/:que', (req, res) => {
    const sql = "DELETE FROM data WHERE \"Question\" = $1 RETURNING *";

    const que = req.params.que;
    pool.query(sql, [que], (err, result) => {
        if (err) return res.json({ Message: "Error inside Server" });
        return res.json(result.rows[0]);
    });
});

app.get('/', (req, res) => {
    return res.json("From Backend");
});

app.listen(8081, () => {
    console.log("Listening on port 8081");
});
