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
        } else if (filePath.endsWith('.jsx')) {
            results.push(filePath);
        }
    });
    return results;
}

const jsxFiles = walkDir('src');
let changed = 0;

jsxFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Replace text
    content = content.replace(/UCE Marketplace/g, 'Tienda Digital');
    content = content.replace(/UCE Market/g, 'Tienda Digital');
    content = content.replace(/Universidad Central del Ecuador/g, 'tu mundo emprendedor');
    content = content.replace(/comunidad universitaria de la/g, 'comunidad de');
    content = content.replace(/comunidad universitaria/g, 'comunidad emprendedora');
    content = content.replace(/dentro de tu universidad/g, '');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changed++;
        console.log('Updated: ' + file);
    }
});
console.log('Total JSX files updated: ' + changed);
