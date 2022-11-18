const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 9000;
const cors = require("cors");

//-------------------------Use Middleware--------------------------
app.use(express.json());
app.use(cors());

require("./src/Route/Auth")(app);

app.listen(port, () => {
  console.log(`Connect To Server ${port}`);
});
