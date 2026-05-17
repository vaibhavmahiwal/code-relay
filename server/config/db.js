import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // --- EMERGENCY CLEANUP: Remove ghost indexes and bad data ---
    const db = conn.connection.db;
    const collections = await db.listCollections({ name: 'users' }).toArray();
    
    if (collections.length > 0) {
      const userCollection = db.collection('users');
      
      // 1. Force drop the ghost index that's causing the 500 errors
      try {
        await userCollection.dropIndex('email_1');
        console.log('🧹 Ghost index "email_1" dropped successfully.');
      } catch (e) {
        // Index might already be gone, which is fine
      }

      // 2. Optional: Wipe old users to ensure a clean start for the next person
      // await userCollection.deleteMany({}); 
      // console.log('🗑️ Old test users cleared.');
    }

  } catch (err) {
    console.error(`❌ DB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;