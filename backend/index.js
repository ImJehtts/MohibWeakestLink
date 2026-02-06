const express = require('express');
const app = express();

app.use("/", (req, res) => {
    res.send("Hello from the backend!");
});

app.listen(5123, () => {
    console.log("Backend server is running on port 5123");
});
