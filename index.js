const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// Middle Ware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v2tgv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanics");
        const servicesCollection = database.collection("services");

        // GET API
        app.get('/services', async (req, res)=>{
            const cursor = servicesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // GET SINGLE SERVICE
        app.get('/services/:id', async (req, res)=>{
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log(service);
            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            res.json(result)
        });

        // DELETE API
        app.delete('/services/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running genius mechanics server')
});

// user name: geniususer
// password: l30x70lZZC4LdG65




app.listen(port, () => {
    console.log(`app is listening from port ${port}`);
})