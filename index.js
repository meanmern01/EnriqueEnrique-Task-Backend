const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 9000

//-------------------------Use Middleware--------------------------
app.use(express.json())

require('./src/Route/Auth')(app);

app.listen(port, () => {
    console.log(`Connect To Server ${port}`);
})