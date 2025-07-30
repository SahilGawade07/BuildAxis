import mongoose from "mongoose";
import { DB_NAME } from "../constants";

interface DatabaseConfig {
  uri: string;
  name: string;
}

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    const config: DatabaseConfig = {
      uri: mongoUri,
      name: DB_NAME,
    };

    // Check if the URI already contains a database name
    const hasDatabaseName =
      config.uri.includes("/") && !config.uri.endsWith("/");

    let connectionString: string;
    if (hasDatabaseName) {
      // If URI already has a database name, use it as is
      connectionString = config.uri;
    } else {
      // If URI doesn't have a database name, append it
      connectionString = `${config.uri}/${config.name}`;
    }

    const connectionInstance = await mongoose.connect(connectionString);

    console.log(`\n✅ MongoDB connected successfully!`);
    console.log(`📊 Database: ${config.name}`);
    console.log(`🌐 Host: ${connectionInstance.connection.host}`);
    console.log(`🔌 Port: ${connectionInstance.connection.port}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
