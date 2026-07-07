const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else if (filePath.endsWith('.css')) {
            results.push(filePath);
        }
    });
    return results;
}

const cssFiles = walkDir('src');
let changed = 0;

cssFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Replace hardcoded dark colors with white for frosted glass effect on beige background
    content = content.replace(/30,\s*41,\s*59/g, '255, 255, 255');
    content = content.replace(/15,\s*23,\s*42/g, '255, 255, 255');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changed++;
        console.log('Updated: ' + file);
    }
});
console.log('Total CSS files updated: ' + changed);
