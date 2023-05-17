const fs = require('fs');
const path = require('path');

function _(rootPath) {
  const fileLocations = [];
  const files = fs.readdirSync(rootPath);
  for (const file of files) {
    const filePath = path.join(rootPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileLocations.push(..._(filePath));
    } else {
      fileLocations.push(filePath);
    }
  }

  return fileLocations;
}

module.exports = _

