import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";


export async function POST(request) {

    // Replace the uri string with your connection string.
    let {action, slug, initialQuantity} = await request.json()
    const uri = "mongodb+srv://vishal:Vishal7249@adbms-mini-project.tfbyogv.mongodb.net/";

    const client = new MongoClient(uri);
    try {
        const database = client.db('stock-1');
        const inventory = database.collection('inventory');
    
        // Create a filter for movies with the title "Random Harvest"
        const filter = { slug: slug };

        // Specify the update to set a value for the plot field
        let newQuantity = action=="plus"? (parseInt(initialQuantity) + 1): (parseInt(initialQuantity) - 1)
        const updateDoc = {
          $set: {
            quantity: newQuantity
          },
        };
        // Update the first document that matches the filter
        const result = await inventory.updateOne(filter, updateDoc, {});
        return NextResponse.json({ success: true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`})
      } finally {
        // Close the connection after the operation completes
        await client.close();
      }
}