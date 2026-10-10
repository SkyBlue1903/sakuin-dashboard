const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./components');
files.push('./app/page.tsx');
files.push('./app/kartu/page.tsx');
files.push('./app/layout.tsx');

let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace colors
  content = content.replace(/emerald-/g, 'success-');
  content = content.replace(/amber-/g, 'warning-');
  content = content.replace(/red-/g, 'error-');
  content = content.replace(/blue-/g, 'blue-light-');

  // Any specific typography classes if needed? 
  // Let's stick to colors first, they are clearly the semantic ones mentioned in colors.css.

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
    changedCount++;
  }
});

console.log('Total files changed:', changedCount);
