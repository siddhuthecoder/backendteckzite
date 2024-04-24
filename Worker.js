import mongoose from 'mongoose';
import UserQRModel from './models/userQRModel';

// Function to add data to the MongoDB collection from a JSON file
const filePath = 'output.json';
addDataFromFile(filePath);

async function addDataFromFile(filePath) {
  try {
    // Read JSON file
    const jsonData = await import(filePath);

    // Insert documents into the MongoDB collection
    const insertResult = await UserQRModel.insertMany(jsonData.default);
    console.log(`${insertResult.length} documents inserted successfully.`);
  } catch (error) {
    console.error('Error adding data:', error);
  }
}
