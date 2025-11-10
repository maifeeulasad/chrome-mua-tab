const { createCanvas } = require('canvas');
const fs = require('fs');

// Create a 128x128 canvas
const canvas = createCanvas(128, 128);
const ctx = canvas.getContext('2d');

// Set background
ctx.fillStyle = '#2196F3'; // Material Blue
ctx.fillRect(0, 0, 128, 128);

// Add text
ctx.fillStyle = 'white';
ctx.font = 'bold 40px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('MUA', 64, 64);

// Add a tab-like shape at the top
ctx.beginPath();
ctx.moveTo(20, 30);
ctx.lineTo(108, 30);
ctx.lineTo(108, 90);
ctx.lineTo(20, 90);
ctx.closePath();
ctx.strokeStyle = 'white';
ctx.lineWidth = 3;
ctx.stroke();

// Save the image
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('icon128.png', buffer);
console.log('Icon generated successfully!');