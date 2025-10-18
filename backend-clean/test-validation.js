const { sanitizeInput } = require('./utils/validation');

console.log('Testing sanitizeInput...');
try {
  const result = sanitizeInput('test search');
  console.log('sanitizeInput result:', result);
} catch (error) {
  console.error('sanitizeInput error:', error);
}
