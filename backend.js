// mongodb+srv://antonionapoli394:antonionapoli394@o-semeador-site.s0mxq.mongodb.net/?retryWrites=true&w=majority&appName=O-Semeador-site

const express = require ('express')
const app = express()
const cors = require ('cors')
const mongoose = require('mongoose')

app.use(express.json())
app.use(cors())




async function conectarAoMongoDB() {
    await
    mongoose.connect(`mongodb+srv://antonionapoli394:w9cgye9u3jI0VGbc@o-semeador.s0mxq.mongodb.net/?retryWrites=true&w=majority&appName=O-Semeador`)
}

app.listen(3000, () => {
    try{
    conectarAoMongoDB()
    console.log("up and running")
    }
    catch (e){
    console.log('Erro', e)
    }
})
    
    