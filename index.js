import express from "express"
import proizvodiJS from "./routes/proizvodiJS.js"

const app = express();
const PORT = 3000;


app.use(express.json())

let ime = "Patrik"
let prezime = "Fabijanic"

app.get("/", (req, res) => {
    res.send(`Pozdrav ${ime} ${prezime}`)
})

app.post("/proizvodi", proizvodiJS)


app.get("/proizvodi", proizvodiJS)

app.get("/proizvodi/:id", proizvodiJS)

app.patch("/proizvodi/:id", proizvodiJS)

app.delete("/proizvodi/:id", proizvodiJS)

app.listen(PORT, () => {
    console.log("sve radi")
})