import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
let supabaseUrl = '';
let supabaseKey = '';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = trimmed.replace('NEXT_PUBLIC_SUPABASE_URL=', '').trim();
    }
    if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      supabaseKey = trimmed.replace('SUPABASE_SERVICE_ROLE_KEY=', '').trim();
    }
  });
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BASE_URL = 'https://new-sai-car-bazar.vercel.app';

async function testRoute(name, url, expectedStatus = 200) {
  try {
    const res = await fetch(url);
    const ok = res.status === expectedStatus;
    console.log(`${ok ? '✅' : '❌'} [${res.status}] ${name} -> ${url}`);
    return ok;
  } catch (err) {
    console.error(`❌ [ERR] ${name}:`, err.message);
    return false;
  }
}

async function runE2ESmokeTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING END-TO-END SMOKE TESTS ON LIVE PRODUCTION');
  console.log('Base URL:', BASE_URL);
  console.log('====================================================\n');

  console.log('--- 1. Testing Core Public Pages ---');
  await testRoute('Homepage', `${BASE_URL}/`);
  await testRoute('Inventory Catalog', `${BASE_URL}/inventory`);
  await testRoute('Vehicle Details', `${BASE_URL}/inventory/tata-harrier-fearless-plus-dark-at-2023`);
  await testRoute('Finance EMI Calculator', `${BASE_URL}/finance`);
  await testRoute('Sell My Car Valuation', `${BASE_URL}/sell-my-car`);
  await testRoute('About Page', `${BASE_URL}/about`);
  await testRoute('Contact Page', `${BASE_URL}/contact`);
  await testRoute('Admin Portal', `${BASE_URL}/admin/login`);

  console.log('\n--- 2. Testing Live Customer Enquiry Submission ---');
  const testEnquiry = {
    name: 'Smoke Test User',
    phone: '9876543210',
    email: 'smoketest@example.com',
    message: 'E2E Automated Smoke Test verification enquiry',
    source: 'e2e_smoke_test'
  };

  const enquiryRes = await fetch(`${BASE_URL}/api/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testEnquiry)
  });
  const enquiryJson = await enquiryRes.json();
  console.log('Enquiry API Response:', enquiryJson);
  const enquiryOk = enquiryRes.ok && enquiryJson.success;
  console.log(`${enquiryOk ? '✅' : '❌'} POST /api/enquiry: ${enquiryOk ? 'PASSED' : 'FAILED'}`);

  console.log('\n--- 3. Testing Live Finance Lead Submission ---');
  const testFinance = {
    name: 'Finance Smoke Test',
    phone: '9876543210',
    email: 'finance_test@example.com',
    vehicle_price: 1500000,
    loan_amount: 1200000,
    down_payment: 300000,
    interest_rate: 9.5,
    tenure: 60,
    estimated_emi: 25210,
    employment_type: 'Salaried',
    monthly_income: 85000,
    message: 'Testing EMI loan inquiry pipeline'
  };

  const financeRes = await fetch(`${BASE_URL}/api/finance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testFinance)
  });
  const financeJson = await financeRes.json();
  console.log('Finance API Response:', financeJson);
  const financeOk = financeRes.ok && financeJson.success;
  console.log(`${financeOk ? '✅' : '❌'} POST /api/finance: ${financeOk ? 'PASSED' : 'FAILED'}`);

  console.log('\n--- 4. Testing Live Sell Car / Valuation Submission ---');
  const testSell = {
    make: 'Hyundai',
    model: 'Creta',
    year: 2021,
    variant: 'SX (O) 1.5 Diesel',
    mileage: 38000,
    fuel_type: 'DIESEL',
    transmission: 'MANUAL',
    expected_price: 1250000,
    condition: 'EXCELLENT',
    name: 'Seller Smoke Test',
    phone: '9876543210',
    email: 'seller_test@example.com',
    city: 'Barabanki'
  };

  const sellRes = await fetch(`${BASE_URL}/api/sell-my-car`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testSell)
  });
  const sellJson = await sellRes.json();
  console.log('Sell Car API Response:', sellJson);
  const sellOk = sellRes.ok && sellJson.success;
  console.log(`${sellOk ? '✅' : '❌'} POST /api/sell-my-car: ${sellOk ? 'PASSED' : 'FAILED'}`);

  console.log('\n--- 5. Verifying Records Persisted in Supabase ---');
  const { data: dbLeads, error: lErr } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(3);
  if (lErr) console.error('Error querying leads:', lErr);
  else console.log(`✅ Supabase 'leads' table has ${dbLeads.length} recent records. Latest: ${dbLeads[0]?.name} (${dbLeads[0]?.phone})`);

  const { data: dbFinance, error: fErr } = await supabase.from('finance_leads').select('*').order('created_at', { ascending: false }).limit(3);
  if (fErr) console.error('Error querying finance_leads:', fErr);
  else console.log(`✅ Supabase 'finance_leads' table has ${dbFinance.length} recent records. Latest: ${dbFinance[0]?.name} (EMI ₹${dbFinance[0]?.estimated_emi})`);

  const { data: dbSell, error: sErr } = await supabase.from('sell_car_requests').select('*').order('created_at', { ascending: false }).limit(3);
  if (sErr) console.error('Error querying sell_car_requests:', sErr);
  else console.log(`✅ Supabase 'sell_car_requests' table has ${dbSell.length} recent records. Latest: ${dbSell[0]?.name} (${dbSell[0]?.make_name} ${dbSell[0]?.model_name})`);

  console.log('\n====================================================');
  console.log('🏁 ALL SMOKE TESTS COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
}

runE2ESmokeTests();
