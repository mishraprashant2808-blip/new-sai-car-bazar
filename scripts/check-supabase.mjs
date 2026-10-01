import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
let supabaseUrl = '';
let supabaseAnonKey = '';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = trimmed.replace('NEXT_PUBLIC_SUPABASE_URL=', '').trim();
    }
    if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = trimmed.replace('NEXT_PUBLIC_SUPABASE_ANON_KEY=', '').trim();
    }
  });
}

console.log('Testing Supabase Connection:');
console.log('URL:', supabaseUrl || '(not found)');
console.log('Key length:', supabaseAnonKey ? supabaseAnonKey.length : 0);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  console.log('\n--- 1. Testing Network Connection to Supabase Endpoint ---');
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });
    console.log(`Endpoint HTTP Status: ${res.status} ${res.statusText}`);
  } catch (err) {
    console.error('Network connectivity error:', err.message);
  }

  console.log('\n--- 2. Checking Database Tables ---');
  const tables = ['makes', 'models', 'vehicles', 'vehicle_images', 'leads', 'finance_leads', 'sell_car_requests', 'site_settings'];

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ Table '${table}': Error -> ${error.message} (Code: ${error.code})`);
      } else {
        console.log(`✅ Table '${table}': Accessible! (Row count: ${count ?? 'unknown'})`);
      }
    } catch (e) {
      console.log(`❌ Table '${table}': Exception -> ${e.message}`);
    }
  }

  console.log('\n--- 3. Checking Storage Buckets ---');
  try {
    const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
    if (bucketErr) {
      console.log(`❌ Storage: Error listing buckets -> ${bucketErr.message}`);
    } else {
      console.log(`✅ Storage: Found ${buckets?.length || 0} buckets:`, buckets?.map(b => b.name) || []);
    }
  } catch (e) {
    console.log(`❌ Storage: Exception -> ${e.message}`);
  }

  console.log('\n--- 4. Checking Supabase Auth Service ---');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log(`❌ Auth Service: Error -> ${error.message}`);
    } else {
      console.log('✅ Auth Service: Responding properly!');
    }
  } catch (e) {
    console.log(`❌ Auth Service: Exception -> ${e.message}`);
  }
}

runTests();
