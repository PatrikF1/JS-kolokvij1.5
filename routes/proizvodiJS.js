import { error } from 'console'
import express, { query } from 'express'
import fs from 'fs/promises'

const router = express.Router()

async function dohvati () {
  try {
    const data = await fs.readFile('data.json', 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('greska brate teska')
    return error
  }
}

router.get('/proizvodi', async (req, res) => {
  let allah = await dohvati()
  let marke = req.query.marke
  try {

    let nadeno = allah.filter(m => m.marka == marke)

    if(marke) {
        res.status(200).json(nadeno)
    } 
        else{res.status(200).json(allah)}
    


  } catch (error) {
    res.status(400).send('ne dela nista bato')
  }
})


router.post('/proizvodi', async (req, res) => {
    let korisnik = req.body
/*
    let obavezni = ["id", "marka", "model", "godina_proizvodnje", "zaliha", "ocjena"]

    for(let atribut of obavezni) {
        if(!Object.keys(korisnik).includes(atribut)) {
            res.status(400).send(`greska nedostaje atribut ${atribut}`)
            return 
        }
    }

*/
    try {

        let korisnici = await dohvati();

        for(let k of korisnici){
            if(k.marka == korisnik.marka && k.model == korisnik.model && k.godina_proizvodnje == korisnik.godina_proizvodnje) {
                res.status(400).json("Greška! Proizvod već postoji u bazi");
                return
            }
        }

        let index = korisnici.length


        while(korisnici.find(i => i.id == index)){
            index++
        }

        korisnik.id = index

        korisnici.push(korisnik)

        await dodaj(korisnici)
        
        res.status(200).json(korisnici)
        

    } catch(error) {
        res.status(500).send("nece radit care")
    }
})


async function dodaj (korisnik) {
    
    try {
        await fs.writeFile("data.json", JSON.stringify(korisnik), "utf8")
    } catch(error) {
        console.error("greska pri pisanju u datoteku")
    }
}

router.get("/proizvodi/:id", async (req, res) => {
    let proizvodi_id = req.params.id;

    try {
        let data = await fs.readFile("data.json", "utf8") 
        let proizvodi = JSON.parse(data)

        let provjera = proizvodi.find(k => k.id == proizvodi_id)

        let message = " Uspješno dohvaćen proizvod s ID-em " + proizvodi_id

        if(!provjera) {
            res.status(400).send("Taj id ne postoji")
            return 
        }
        
        res.status(200).json({provjera, message})


    } catch (error) {
        res.status(400).send("ne radi mi ovaj dio koda")
    }
})


router.patch("/proizvodi/:id", async (req, res) => {
    let proizvodi_id = req.params.id;
    let novaZaliha = req.body.zaliha

    try {
        let proizvodi = await dohvati();
        
        let trazeni = proizvodi.find(pr => pr.id == proizvodi_id)

        if(!trazeni) {
            res.status(400).send("Taj id ne postoji")
            return
        }


        if(novaZaliha <= 0){
            res.status(400).send("premala je zaliha")
            return
        }
        

        trazeni.zaliha = novaZaliha;

        await fs.writeFile("data.json", JSON.stringify(proizvodi), "utf8")

        res.status(201).json(trazeni)

    } catch (error) {
        res.status(400).send("ne radi mi ovaj dio koda")
        console.log(error)
    }
})



router.delete("/proizvodi/:id", async (req, res) => {
    let proizvod_id = req.params.id;

    try {

        let proizvodi = await dohvati();

        let pronaden = proizvodi.find(p => p.id == proizvod_id)

        if(!pronaden) {
            res.status(400).send("ne postoji taj proizvod")
        }

        proizvodi.splice(proizvodi.indexOf(pronaden), 1)

        await dodaj(proizvodi)

        res.status(201).send("proizvod je izbrisan bez beda")

    } catch(error) {
        res.status(400).send("ne radi mi ovaj dio koda")
        console.log(error)

    }
})

export default router
