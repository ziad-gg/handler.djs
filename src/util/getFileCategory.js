const path = require('path');

const getFileCategory = (filePath) => {
  // Extract the directory path from the file path
  const directoryPath = path.dirname(filePath);

  // Extract the last directory name from the path
  const directories = directoryPath.split(path.sep);

  const category = directories[directories.length - 1];

  return category;
};

module.exports = getFileCategory;
