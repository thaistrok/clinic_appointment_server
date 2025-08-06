const bcrypt = require('bcrypt'); console.log('bcrypt is working'); bcrypt.hash('test', 10).then(hash => console.log('Hash generated:', hash)).catch(err => console.error('Error:', err));
