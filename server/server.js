const express = require("express");
const path = require('path');
const app = express();

app.use(express.static('public'))
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
});

// Port

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});