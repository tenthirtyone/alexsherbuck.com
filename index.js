const express = require("express");

const app = express();

app.use(express.static("./public"));
app.use("css", express.static("./public/css"));
app.use("font", express.static("./public/font"));
app.use("img", express.static("./public/img"));

app.listen(4000, () => {
  console.log("App listening on 4000");
});
