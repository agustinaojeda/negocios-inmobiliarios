const express = require("express");
const app = express();

app.use(
  "/data",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static("data"),
);

app.get("/", (req, res) => {
  res.send("Hola desde Express");
});

app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
