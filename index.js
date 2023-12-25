const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mongo Connection
const uri = 'mongodb+srv://mandeep7yadav:eFkrVv2KH0aLJ6cQ@dreamdose.hz54owm.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});
const dreamDose = client.db('Dreamdose').collection('blogs');

// Get all blogs
app.get('/getblogs', async (req, res) => {
  try {
    const allBlogs = await dreamDose.find({}).toArray();
    res.json(allBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single blog by ID
app.get('/getblog/:id', async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await dreamDose.findOne({ _id: new ObjectId(blogId) });
    blog ? res.json(blog) : res.status(404).json({ error: 'Blog not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new blog
app.post('/createblog', async (req, res) => {
  try {
    const newBlog = { ...req.body, Date: new Date(), Time: getTimeNow() };
    const savedBlog = await dreamDose.insertOne(newBlog);
    res.json(savedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a blog by ID
app.delete('/deleteblog/:id', async (req, res) => {
  const blogId = req.params.id;
  try {
    const result = await dreamDose.deleteOne({ _id: new ObjectId(blogId) });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit a blog by ID
app.put('/editblog/:id', async (req, res) => {
  const blogId = req.params.id;
  const updatedBlogData = req.body;
  try {
    const result = await dreamDose.updateOne({ _id: new ObjectId(blogId) }, { $set: updatedBlogData });
    res.json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Server setup and connection
async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Connected to MongoDB!');
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } finally {
    // Keep the connection open; closing is optional here
    // await client.close();
  }
}

run().catch(console.dir);

// Utility function for getting the current time
function getTimeNow() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  return `${hours}:${minutes}:${seconds}`;
}
