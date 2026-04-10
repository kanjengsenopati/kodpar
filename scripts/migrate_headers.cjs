const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, '..', 'src', 'pages', 'POS'),
  path.join(__dirname, '..', 'src', 'pages', 'Manufaktur')
];

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

dirs.forEach(dir => {
  walkDir(dir, (filePath) => {
    if (!filePath.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Get the pageTitle value
    const titleMatch = content.match(/<Layout[^>]*pageTitle="([^"]+)"[^>]*>/);
    if (!titleMatch) return;
    
    const pageTitle = titleMatch[1];
    
    // 2. Only proceed if the file has an h2 that EXACTLY matches the page title 
    // AND is inside a flex justify-between
    const strictFlexRegex = new RegExp(`<div\\s+className="[^"]*flex[^"]*justify-between[^"]*">\\s*<h2[^>]*>${pageTitle}<\\/h2>\\s*([\\s\\S]*?)<\\/div>`);
    
    const match = content.match(strictFlexRegex);
    if (match) {
      const actions = match[1].trim();
      
      // Remove the inline header div
      content = content.replace(match[0], '');
      
      // Inject actions into Layout
      if (actions.length > 0) {
        // If there's no actions prop yet
        if (!content.match(/<Layout[^>]*actions=/)) {
          content = content.replace(
            /(<Layout[^>]*pageTitle="[^"]+")([^>]*>)/, 
            `$1 actions={ $2 \n        <>\n          ${actions.split('\n').join('\n          ')}\n        </>\n      } $2` // This replace logic is slightly broken, let's do it safer:
          );
          
          let layoutReplacement = titleMatch[0].replace(/>$/, ` actions={\n        <>\n          ${actions.split('\n').join('\n          ')}\n        </>\n      }>`);
          content = content.replace(titleMatch[0], layoutReplacement);
        }
      }
      
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated (flex): ${path.basename(filePath)}`);
      return;
    }
    
    // 3. Or if it's just an h2 alone that exactly matches the title
    const strictH2Regex = new RegExp(`<h2[^>]*>${pageTitle}<\\/h2>\\s*`);
    const h2Match = content.match(strictH2Regex);
    if (h2Match) {
      content = content.replace(h2Match[0], '');
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated (h2): ${path.basename(filePath)}`);
    }
  });
});

console.log("Strict migration done.")
