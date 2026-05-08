import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db } | null> {
  if (!uri || !clientPromise) {
    console.warn("MONGODB_URI is not defined in environment variables. Database operations will be bypassed.");
    return null;
  }

  try {
    const connectedClient = await clientPromise;
    const db = connectedClient.db();
    return { client: connectedClient, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return null;
  }
}
