const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;



// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vekfpge.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db('isCloudKitchen').collection('items');
        const reviewCollection = client.db('isCloudKitchen').collection('reviews');

        app.get('/items', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const items = await (await cursor.limit(3).toArray()).reverse();
            // const items = await cursor.limit(3).toArray();
            res.send(items)

        })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const items = await (await cursor.toArray()).reverse();
            // const items = await cursor.toArray();
            res.send(items)

        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        app.post('/items', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await serviceCollection.insertOne(user)
            res.send(result);
        });


        // review api

        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await (await cursor.toArray()).reverse();
            res.send(reviews)
        })

        app.get('/allReview', async (req, res) => {
            let query = {};
            if (req.query.service) {
                query = {
                    service: req.query.service
                }
            }
            const cursor = reviewCollection.find(query);
            const allReview = await cursor.toArray();
            res.send(allReview)
        })


        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })

        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await reviewCollection.findOne(query);
            res.send(user);
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body
            const option = { upsert: true }
            const updatedReview = {
                $set: {
                    review: review.review
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedReview, option)
            res.send(result)
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })





    }
    finally {

    }
}

run().catch(error => console.error(error))




app.get('/', (req, res) => {
    res.send('IS Cloud Kitchen API Running')
})

app.listen(port, () => {
    console.log(`IS Cloud Kitchen Server Running on port ${port}`)
})