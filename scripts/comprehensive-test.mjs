import { readFileSync } from 'fs';
import { resolve } from 'path';

console.log("=================================================");
console.log("🔍 COMPREHENSIVE DIAGNOSTIC & VERIFICATION TEST");
console.log("=================================================\n");

let passedCount = 0;
let totalCount = 0;

function assert(description, condition) {
  totalCount++;
  if (condition) {
    console.log(`✅ [PASS] ${description}`);
    passedCount++;
  } else {
    console.error(`❌ [FAIL] ${description}`);
  }
}

// 1. Check BrowseByMake brands and SVGs
console.log("--- 1. Testing 'Browse by Make' Brands & Original Logos ---");
const browseByMakeContent = readFileSync(resolve('src/components/home/BrowseByMake.tsx'), 'utf-8');
assert("No BMW in BrowseByMake", !browseByMakeContent.toLowerCase().includes('slug: "bmw"'));
assert("No Audi in BrowseByMake", !browseByMakeContent.toLowerCase().includes('slug: "audi"'));
assert("No Mercedes in BrowseByMake", !browseByMakeContent.toLowerCase().includes('slug: "mercedes"'));
assert("No Jeep in BrowseByMake", !browseByMakeContent.toLowerCase().includes('slug: "jeep"'));
assert("No Nissan in BrowseByMake", !browseByMakeContent.toLowerCase().includes('slug: "nissan"'));
assert("No Chevrolet in BrowseByMake", !browseByMakeContent.toLowerCase().includes('slug: "chevrolet"'));
assert("Contains Maruti Suzuki", browseByMakeContent.includes('slug: "maruti-suzuki"'));
assert("Contains Hyundai", browseByMakeContent.includes('slug: "hyundai"'));
assert("Contains Tata", browseByMakeContent.includes('slug: "tata"'));
assert("Contains Mahindra", browseByMakeContent.includes('slug: "mahindra"'));
assert("Contains Kia", browseByMakeContent.includes('slug: "kia"'));
assert("Contains Toyota", browseByMakeContent.includes('slug: "toyota"'));
assert("Contains Honda", browseByMakeContent.includes('slug: "honda"'));
assert("Contains Renault", browseByMakeContent.includes('slug: "renault"'));
assert("Contains Volkswagen", browseByMakeContent.includes('slug: "volkswagen"'));
assert("Uses SVG Brand Logos (No emojis)", !browseByMakeContent.includes('icon: "🚗"') && browseByMakeContent.includes('BrandLogos'));

// 2. Check Brand Logos File
console.log("\n--- 2. Testing Original SVG Brand Logos File ---");
const brandLogosContent = readFileSync(resolve('src/components/icons/BrandLogos.tsx'), 'utf-8');
assert("BrandLogos defines MarutiSuzukiLogo", brandLogosContent.includes('export function MarutiSuzukiLogo'));
assert("BrandLogos defines HyundaiLogo", brandLogosContent.includes('export function HyundaiLogo'));
assert("BrandLogos defines TataLogo", brandLogosContent.includes('export function TataLogo'));
assert("BrandLogos defines MahindraLogo", brandLogosContent.includes('export function MahindraLogo'));
assert("BrandLogos defines KiaLogo", brandLogosContent.includes('export function KiaLogo'));
assert("BrandLogos defines ToyotaLogo", brandLogosContent.includes('export function ToyotaLogo'));
assert("BrandLogos defines HondaLogo", brandLogosContent.includes('export function HondaLogo'));
assert("BrandLogos defines RenaultLogo", brandLogosContent.includes('export function RenaultLogo'));
assert("BrandLogos defines VolkswagenLogo", brandLogosContent.includes('export function VolkswagenLogo'));
assert("BrandLogos defines FordLogo", brandLogosContent.includes('export function FordLogo'));

// 3. Check False Claims Removal
console.log("\n--- 3. Testing Removal of False Claims ---");
const whyBuyContent = readFileSync(resolve('src/components/home/WhyBuySection.tsx'), 'utf-8');
assert("WhyBuySection has NO 7-Day Return Guarantee", !whyBuyContent.includes('7-Day Return Guarantee'));
assert("WhyBuySection has Easy Vehicle Exchange", whyBuyContent.includes('Easy Vehicle Exchange'));

const footerContent = readFileSync(resolve('src/components/layout/Footer.tsx'), 'utf-8');
assert("Footer has NO 150-Point Check", !footerContent.includes('150-Point Pre-Sale Check'));
assert("Footer has Multi-Point Pre-Sale Check", footerContent.includes('Multi-Point Pre-Sale Check'));

const vehicleCardContent = readFileSync(resolve('src/components/ui/VehicleCard.tsx'), 'utf-8');
assert("VehicleCard has NO 150-Point Certified", !vehicleCardContent.includes('150-Point Certified'));
assert("VehicleCard has Multi-Point Verified", vehicleCardContent.includes('Multi-Point Verified'));

const aboutContent = readFileSync(resolve('src/app/about/page.tsx'), 'utf-8');
assert("About page has NO 150-point inspection", !aboutContent.includes('150-point'));

const leadershipContent = readFileSync(resolve('src/components/about/LeadershipSection.tsx'), 'utf-8');
assert("Leadership section has NO 150-point quality verification", !leadershipContent.includes('150-point'));

// 4. Check Google Maps Embed
console.log("\n--- 4. Testing Google Maps Integration ---");
const contactContent = readFileSync(resolve('src/app/contact/page.tsx'), 'utf-8');
assert("Contact page contains Google Maps iframe", contactContent.includes('iframe') && contactContent.includes('maps.google.com'));
assert("Contact page has exact coordinates 26.9296306,81.2186657", contactContent.includes('26.9296306,81.2186657'));
assert("Contact page has direct link to Google Maps place", contactContent.includes('https://www.google.com/maps/place/New+Sai+car+Bazar/@26.9296306,81.2186657'));
assert("Footer contains Google Maps location link", footerContent.includes('https://www.google.com/maps/place/New+Sai+car+Bazar/@26.9296306,81.2186657'));

// 5. Check Vehicle Edit & Price Persistence Logic
console.log("\n--- 5. Testing Vehicle Edit & Price Persistence Logic ---");
const editPageContent = readFileSync(resolve('src/app/admin/inventory/[id]/edit/page.tsx'), 'utf-8');
assert("Edit page passes make object and ID", editPageContent.includes('make: makeObj'));
assert("Edit page passes model object and name", editPageContent.includes('model: modelObj') && editPageContent.includes('model_name: modelObj.name'));
assert("Edit page parses price as Number", editPageContent.includes('price: Number(price)'));
assert("Edit page updates DataStore with full data contract", editPageContent.includes('DataStore.updateVehicle(id, updatedData)'));

const storeContent = readFileSync(resolve('src/lib/data/store.ts'), 'utf-8');
assert("DataStore accepts custom model_name", storeContent.includes('updates.model_name'));
assert("DataStore updateVehicle updates images properly", storeContent.includes('let images = updates.images || list[idx].images'));
assert("DataStore preserves local vehicle edits in fetchVehiclesLive", storeContent.includes('localTime >= remoteTime'));

const adminAuthContent = readFileSync(resolve('src/lib/adminAuth.ts'), 'utf-8');
assert("requireAdminAuth supports resilient session token", adminAuthContent.includes('verifyAdminToken(token)'));
assert("requireAdminAuth supports Supabase Bearer token", adminAuthContent.includes('apikey: supabaseAnonKey'));
assert("requireAdminAuth supports Supabase auth cookies", adminAuthContent.includes('hasSupabaseCookie'));

console.log("\n=================================================");
console.log(`Diagnostic Result: ${passedCount} / ${totalCount} checks passed (${Math.round((passedCount / totalCount) * 100)}%)`);
console.log("=================================================");

if (passedCount !== totalCount) {
  process.exit(1);
}
