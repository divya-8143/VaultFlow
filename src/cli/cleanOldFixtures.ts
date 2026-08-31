import fs from 'fs';
import path from 'path';

const vaultDir = 'D:\\ElevateIQ\\LionixRohith\\github_projects\\VaultFlow';

const dirsToRemove = [
  path.join(vaultDir, 'src/core/fixtures')
];

dirsToRemove.forEach(d => {
  if (fs.existsSync(d)) {
    fs.rmSync(d, { recursive: true, force: true });
    console.log(`Removed ${d}`);
  }
});
