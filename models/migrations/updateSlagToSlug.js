const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function migrateSlagToSlug() {
    try {
        // Connect to MongoDB using the environment variable
        await mongoose.connect(process.env.db_application);
        
        // Get the collection directly to avoid schema validation
        const collection = mongoose.connection.collection('categories');
        
        // Drop the old index if it exists
        try {
            await collection.dropIndex('slag_1');
            console.log('Old index dropped successfully');
        } catch (error) {
            console.log('No old index to drop');
        }

        // Update all documents
        const result = await collection.updateMany(
            {},
            {
                $rename: { "slag": "slug" }
            }
        );

        console.log(`Migration completed successfully. Updated ${result.modifiedCount} documents`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateSlagToSlug();