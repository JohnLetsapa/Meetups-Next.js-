import { MongoClient } from 'mongodb';

// Route: /api/new-meetup
// POST /api/new-meetup

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      'mongodb+srv://admin:2KvYKsTn3RKd8N9E@cluster0.nweio.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const result = await meetupsCollection.insertOne(data);

    client.close();

    res.status(201).json({ message: 'Meetup inserted' });
  }
}

export default handler;
