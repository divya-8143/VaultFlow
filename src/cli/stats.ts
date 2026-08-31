import fs from 'fs';
import path from 'path';

function countLinesInDirectory(dirPath: string): { files: number; lines: number } {
  let totalFiles = 0;
  let totalLines = 0;

  function traverse(currentPath: string) {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!['node_modules', 'dist', '.git', 'coverage'].includes(item)) {
          traverse(fullPath);
        }
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.js') || item.endsWith('.md') || item.endsWith('.json'))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n').length;
        totalFiles++;
        totalLines += lines;
      }
    }
  }

  traverse(dirPath);
  return { files: totalFiles, lines: totalLines };
}

const rootDir = path.join(__dirname, '../../');
const stats = countLinesInDirectory(rootDir);
console.log(`==========================================`);
console.log(`VaultFlow FinTech Codebase Metrics`);
console.log(`Total Files Count: ${stats.files}`);
console.log(`Total Lines of Code: ${stats.lines}`);
console.log(`==========================================`);
