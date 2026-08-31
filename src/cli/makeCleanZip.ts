import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

const vaultDir = 'D:\\ElevateIQ\\LionixRohith\\github_projects\\VaultFlow';
const zipPath = 'D:\\ElevateIQ\\LionixRohith\\github_projects\\VaultFlow.zip';

function createCleanZip() {
  console.log('Creating clean zip archive with .git at root...');

  const zip = new AdmZip();

  // Helper to recursively add local folder to zip under target Zip relative path
  function addFolderToZip(localFolderPath: string, zipRelativePath: string) {
    if (!fs.existsSync(localFolderPath)) return;
    const items = fs.readdirSync(localFolderPath);

    for (const item of items) {
      const fullPath = path.join(localFolderPath, item);
      const targetZipPath = zipRelativePath ? `${zipRelativePath}/${item}` : item;
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        addFolderToZip(fullPath, targetZipPath);
      } else if (stat.isFile()) {
        const fileData = fs.readFileSync(fullPath);
        zip.addFile(targetZipPath, fileData);
      }
    }
  }

  // Add directories at zip root
  console.log('Adding .git directory...');
  addFolderToZip(path.join(vaultDir, '.git'), '.git');

  console.log('Adding src directory...');
  addFolderToZip(path.join(vaultDir, 'src'), 'src');

  console.log('Adding tests directory...');
  addFolderToZip(path.join(vaultDir, 'tests'), 'tests');

  console.log('Adding docs directory...');
  addFolderToZip(path.join(vaultDir, 'docs'), 'docs');

  // Add top-level files
  const rootFiles = [
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'jest.config.js',
    'README.md',
    '.gitignore',
    'Dockerfile',
    'Makefile',
    'app.ts',
    'server.ts'
  ];

  rootFiles.forEach(file => {
    const fullPath = path.join(vaultDir, file);
    if (fs.existsSync(fullPath)) {
      console.log(`Adding ${file}...`);
      zip.addLocalFile(fullPath);
    }
  });

  zip.writeZip(zipPath);
  const sizeMb = (fs.statSync(zipPath).size / 1024 / 1024).toFixed(2);
  console.log(`✅ Successfully created ${zipPath} (${sizeMb} MB) with .git at archive root!`);
}

createCleanZip();
