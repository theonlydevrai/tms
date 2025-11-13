/**
 * Quick Password Hash Generator
 * This uses your backend's exact bcrypt setup
 * Run: cd backend && node quick-hash.js
 */

const bcrypt = require('bcryptjs');

const password = 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('\n========================================');
  console.log('Password Hash Generated!');
  console.log('========================================');
  console.log('\nPassword:', password);
  console.log('Hash:', hash);
  console.log('\n========================================');
  console.log('SQL Command to Update:');
  console.log('========================================');
  console.log(`\nUSE theatre_management_system;`);
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE user_id = 'admin-001';`);
  console.log('\n========================================\n');
  
  // Test the hash
  bcrypt.compare(password, hash, (err, result) => {
    console.log('Verification test:', result ? '✅ WORKS!' : '❌ FAILED');
    console.log('\n========================================\n');
  });
});
