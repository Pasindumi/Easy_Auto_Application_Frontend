const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const dirs = ['./app', './components'];
let files = [];
dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    files = walkSync(dir, files);
  }
});

let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace <ActivityIndicator size="large" ... /> with <Loading />
  const regex = /<ActivityIndicator\s+size=["']large["'][^>]*\/>/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '<Loading />');
    
    // Add import if not exists
    if (!content.includes('import Loading from')) {
      // Find the last import
      const importRegex = /^import.*?;?\s*$/gm;
      let lastIndex = 0;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        lastIndex = importRegex.lastIndex;
      }
      
      const importStr = '\nimport Loading from \'@/components/ui/Loading\';\n';
      if (lastIndex === 0) {
        content = importStr + content;
      } else {
        content = content.slice(0, lastIndex) + importStr + content.slice(lastIndex);
      }
    }
    
    fs.writeFileSync(file, content);
    modifiedCount++;
    console.log('Modified: ' + file);
  }
});

console.log('Total files modified: ' + modifiedCount);
