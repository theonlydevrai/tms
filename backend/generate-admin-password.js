/**
 * Generate Admin Password Hash
 * Run this with: node generate-admin-password.js
 */

const bcrypt = require('bcryptjs');

async function generateHash() {
  // Generate hash for multiple password options
  const passwords = ['Admin@123', 'admin123', 'Admin123'];
  
  console.log('Generating password hashes...\n');
  
  for (const pwd of passwords) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pwd, salt);
    console.log(`Password: ${pwd}`);
    console.log(`Hash: ${hash}`);
    console.log('SQL Update:');
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE user_id = 'admin-001';`);
    console.log('---\n');
  }
}

generateHash().catch(console.error);
