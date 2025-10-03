#!/usr/bin/env node

/**
 * Script to generate bcrypt hash for admin password
 * Usage: node scripts/generate-password-hash.js [password]
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

async function generateHash() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let password;
  
  if (process.argv[2]) {
    password = process.argv[2];
  } else {
    password = await new Promise((resolve) => {
      rl.question('Enter admin password: ', (answer) => {
        resolve(answer);
      });
    });
  }

  if (!password || password.length < 8) {
    console.error('❌ Password must be at least 8 characters long');
    process.exit(1);
  }

  try {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    
    console.log('\n✅ Password hash generated successfully!');
    console.log('\n📋 Add this to your .env file:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('\n🔒 Keep your password secure and never share it!');
    
  } catch (error) {
    console.error('❌ Error generating hash:', error.message);
    process.exit(1);
  }

  rl.close();
}

generateHash();

