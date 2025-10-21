import express from "express";

const app = express();

app.use(express.json());
const PORT = 8080;

app.get("/", (req, res) => {
  res.send("Server is Running!");
});

app.post("/ussd", (req, res) => {});
app.post("/sms", (req, res) => {});
app.post("/sms/broacast", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
