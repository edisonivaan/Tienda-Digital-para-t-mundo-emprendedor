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
    // Replace old blue RGB with new beige RGB
    content = content.replace(/59,\s*130,\s*246/g, '139, 115, 85');
    // Replace old yellow RGB with new accent beige RGB
    content = content.replace(/245,\s*158,\s*11/g, '210, 166, 121');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changed++;
        console.log('Updated: ' + file);
    }
});
console.log('Total files updated: ' + changed);
