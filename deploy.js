#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment process...\n');

// Check if required files exist
const requiredFiles = [
    'server/package.json',
    'client/package.json',
    'server/.env.production',
    'client/.env.production'
];

requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        console.error(`❌ Required file missing: ${file}`);
        process.exit(1);
    }
});

console.log('✅ All required files found\n');

// Build client
console.log('📦 Building client...');
try {
    execSync('cd client && npm run build', { stdio: 'inherit' });
    console.log('✅ Client build successful\n');
} catch (error) {
    console.error('❌ Client build failed');
    process.exit(1);
}

// Install server dependencies
console.log('📦 Installing server dependencies...');
try {
    execSync('cd server && npm install --production', { stdio: 'inherit' });
    console.log('✅ Server dependencies installed\n');
} catch (error) {
    console.error('❌ Server dependency installation failed');
    process.exit(1);
}

console.log('🎉 Deployment preparation complete!');
console.log('\n📋 Next steps:');
console.log('1. Deploy server to Vercel/Railway/Render');
console.log('2. Deploy client/dist to Netlify/Vercel');
console.log('3. Update environment variables');
console.log('4. Test the deployed application');
console.log('\nSee DEPLOYMENT.md for detailed instructions.');