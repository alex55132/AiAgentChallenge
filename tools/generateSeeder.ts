import * as fs from 'fs';
import * as path from 'path';

// Get migration name from command-line arguments
const seederName = process.argv[2];

if (!seederName) {
  console.error('❌ Please provide a seeding name.');
  process.exit(1);
}

// Define paths
const seedersDir = path.resolve('./', 'db/seeders');
const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14); // YYYYMMDDHHMMSS
const fileName = `${timestamp}-${seederName}.ts`;
const filePath = path.join(seedersDir, fileName);

// Seeder template
const seedersTemplate = `import { QueryInterface, DataTypes } from "sequelize";

/** @type {import("sequelize-cli").Migration} */
export default {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {

    //your code here 

    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {

      //your code here

    });
  },
};

`;

// Ensure seeders directory exists
if (!fs.existsSync(seedersDir)) {
  fs.mkdirSync(seedersDir, { recursive: true });
}

// Write seeders file
fs.writeFileSync(filePath, seedersTemplate);

console.log(`✅ Seeder created: ${filePath}`);
