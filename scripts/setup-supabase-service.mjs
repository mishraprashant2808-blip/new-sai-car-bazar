import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
let supabaseUrl = '';
let serviceRoleKey = '';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = trimmed.replace('NEXT_PUBLIC_SUPABASE_URL=', '').trim();
    }
    if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      serviceRoleKey = trimmed.replace('SUPABASE_SERVICE_ROLE_KEY=', '').trim();
    }
  });
}

console.log('Testing Supabase Service Role connection:');
console.log('URL:', supabaseUrl);
console.log('Service Role Key Length:', serviceRoleKey ? serviceRoleKey.length : 0);

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing URL or service role key');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log('\n--- 1. Testing Storage Buckets ---');
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError);
  } else {
    console.log('Current buckets:', buckets.map(b => b.name));
    const vehicleBucket = buckets.find(b => b.name === 'vehicles');
    if (!vehicleBucket) {
      console.log('Creating public "vehicles" storage bucket...');
      const { data: newBucket, error: createError } = await supabaseAdmin.storage.createBucket('vehicles', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/jpg']
      });
      if (createError) {
        console.error('Error creating bucket:', createError);
      } else {
        console.log('✅ Bucket "vehicles" created successfully with public access!');
      }
    } else {
      console.log('✅ Bucket "vehicles" already exists.');
    }
  }

  console.log('\n--- 2. Checking Auth Users ---');
  const { data: usersData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
  if (userError) {
    console.error('Error listing users:', userError);
  } else {
    console.log(`Found ${usersData.users.length} registered auth users:`);
    usersData.users.forEach(u => console.log(`- ${u.email} (${u.id})`));
  }
}

main();
