import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

const dbName = 'siteCatalog';
const uri = "mongodb+srv://terreorenan68:rv9mUE0Q6TJ1IXbJ@gofing.pquxsyl.mongodb.net/?retryWrites=true&w=majority&appName=gofing";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function POST(req : Request) {

  const searchText = await req.json();

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('sites');
    const searchResult = await collection.find({ tags: {$regex: new RegExp(searchText.search, 'i')} }).toArray();
    
    return NextResponse.json(searchResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: ["error"]});
  } finally {
    await client.close();
  }
}
