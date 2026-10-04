import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const envPath = path.resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found');
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const lines = content.split('\n');

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  
  const key = trimmed.slice(0, eqIdx).trim();
  const value = trimmed.slice(eqIdx + 1).trim();

  if (!key || !value) continue;

  console.log(`Setting ${key} in Vercel (production, preview, development)...`);
  try {
    execSync(`vercel env add ${key} production,preview,development --value "${value}" --yes --force`, {
      stdio: 'inherit'
    });
    console.log(`✅ Added ${key}`);
  } catch (err) {
    console.error(`Failed to add ${key}:`, err.message);
  }
}

console.log('\nAll environment variables synchronized to Vercel!');
