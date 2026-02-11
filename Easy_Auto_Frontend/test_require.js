const path = require('path');
const fs = require('fs');

try {
  const target = require('./node_modules/hermes-parser/dist/utils/createSyntaxError.js');
  console.log('Successfully required createSyntaxError:', target);
} catch (e) {
  console.error('Failed to require from root:', e);
}

const stripPath = path.resolve('./node_modules/hermes-parser/dist/estree/StripComponentSyntax.js');
console.log('Strip path:', stripPath);
if (fs.existsSync(stripPath)) {
    try {
        const strip = require(stripPath);
        console.log('Successfully required StripComponentSyntax');
    } catch (e) {
        console.error('Failed to require StripComponentSyntax:', e);
    }
} else {
    console.error('StripComponentSyntax.js does not exist');
}
