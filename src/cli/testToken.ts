import { execSync } from 'child_process';
import https from 'https';

function getGitHubToken(): string {
  try {
    const input = 'protocol=https\nhost=github.com\n\n';
    const output = execSync('git credential fill', { input, encoding: 'utf8' });
    const match = output.match(/password=(.+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  } catch (e: any) {
    console.error('Error fetching git credentials:', e.message);
  }
  return '';
}

const token = getGitHubToken();
if (token) {
  console.log('GitHub Personal Access Token / Credential successfully loaded!');
} else {
  console.log('No token found in git credential manager.');
}
