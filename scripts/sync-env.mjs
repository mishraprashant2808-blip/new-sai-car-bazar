import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

const envPath = path.resolve(process.cwd(), '.env.local');
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
  if (key === 'NEXT_PUBLIC_SUPABASE_URL') continue; // already added

  console.log(`Setting ${key}...`);
  const result = spawnSync('vercel.cmd', ['env', 'add', key, 'production,preview,development', '--force'], {
    input: value + '\n',
    encoding: 'utf8',
    shell: true
  });

  if (result.error) {
    console.error(`Error adding ${key}:`, result.error);
  } else {
    console.log(result.stdout || result.stderr);
  }
}
console.log('Done syncing env vars!');
