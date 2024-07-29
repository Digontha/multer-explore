const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"))

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jp082z4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let imageCollection;

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        imageCollection = client.db("multerServer").collection("images");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
}

run().catch(console.dir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/Images"); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filename = req.file.filename;
        const path = req.file.path;
        console.log(path);
        const data = { filename: filename, path: path }; // Wrap the filename in an object
        const result = await imageCollection.insertOne(data);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: "Failed to upload image" });
    }
});

app.get("/upload", async (req, res) => {
    const data = req.body.filename
    const result = await imageCollection.findOne(data);
    res.send(result);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
