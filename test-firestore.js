require('ts-node').register();
const { getExperiences } = require('./lib/firestore');
getExperiences().then(res => console.log('Success:', res)).catch(err => console.error('Error:', err));
