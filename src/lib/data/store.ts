import { Vehicle, Make, Model, Lead, FinanceLead, SellCarRequest, SiteSettings, VehicleStatus, FuelType, TransmissionType, BodyType, Agreement } from "@/types";
import { INITIAL_VEHICLES, INITIAL_MAKES, INITIAL_MODELS, INITIAL_SITE_SETTINGS, INITIAL_LEADS, INITIAL_FINANCE_LEADS, INITIAL_SELL_CAR_REQUESTS, INITIAL_AGREEMENTS } from "./mockData";
import { supabase } from "@/lib/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/admin";

// In-memory runtime cache for development & fallback when Supabase keys are pending
let vehiclesCache: Vehicle[] = [...INITIAL_VEHICLES];
let makesCache: Make[] = [...INITIAL_MAKES];
let modelsCache: Model[] = [...INITIAL_MODELS];
let siteSettingsCache: SiteSettings = { ...INITIAL_SITE_SETTINGS };
let leadsCache: Lead[] = [...INITIAL_LEADS];
let financeLeadsCache: FinanceLead[] = [...INITIAL_FINANCE_LEADS];
let sellCarCache: SellCarRequest[] = [...INITIAL_SELL_CAR_REQUESTS];
// Global singleton store for agreements across API routes and page requests
const globalStore = globalThis as unknown as { __agreementsCache?: Agreement[] };
if (!globalStore.__agreementsCache) {
  globalStore.__agreementsCache = [...INITIAL_AGREEMENTS];
}
function getAgreementsCache(): Agreement[] {
  if (!globalStore.__agreementsCache) {
    globalStore.__agreementsCache = [...INITIAL_AGREEMENTS];
  }
  return globalStore.__agreementsCache;
}
function setAgreementsCache(items: Agreement[]) {
  globalStore.__agreementsCache = items;
}

export interface InventoryFilterParams {
  search?: string;
  make?: string;
  model?: string;
  fuel?: string;
  transmission?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  status?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'mileage_asc';
}

export const DataStore = {
  // --- VEHICLES ---
  getVehicles(filters?: InventoryFilterParams): Vehicle[] {
    let result = [...vehiclesCache];

    if (filters) {
      if (filters.status) {
        result = result.filter(v => v.status === filters.status);
      } else {
        // default public view: AVAILABLE, RESERVED, SOLD
        result = result.filter(v => v.status !== 'DRAFT' && v.status !== 'ARCHIVED');
      }

      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        result = result.filter(v => 
          v.variant?.toLowerCase().includes(q) ||
          v.make?.name.toLowerCase().includes(q) ||
          v.model?.name.toLowerCase().includes(q) ||
          v.color?.toLowerCase().includes(q) ||
          v.year.toString().includes(q) ||
          v.registration_number?.toLowerCase().includes(q)
        );
      }

      if (filters.make && filters.make !== 'all') {
        result = result.filter(v => v.make?.slug.toLowerCase() === filters.make?.toLowerCase() || v.make_id === filters.make);
      }

      if (filters.model && filters.model !== 'all') {
        result = result.filter(v => v.model?.slug.toLowerCase() === filters.model?.toLowerCase() || v.model_id === filters.model);
      }

      if (filters.fuel && filters.fuel !== 'all') {
        result = result.filter(v => v.fuel_type.toLowerCase() === filters.fuel?.toLowerCase());
      }

      if (filters.transmission && filters.transmission !== 'all') {
        result = result.filter(v => v.transmission.toLowerCase() === filters.transmission?.toLowerCase());
      }

      if (filters.bodyType && filters.bodyType !== 'all') {
        result = result.filter(v => v.body_type.toLowerCase() === filters.bodyType?.toLowerCase());
      }

      if (filters.minPrice !== undefined && filters.minPrice > 0) {
        result = result.filter(v => v.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        result = result.filter(v => v.price <= filters.maxPrice!);
      }

      if (filters.minYear !== undefined && filters.minYear > 0) {
        result = result.filter(v => v.year >= filters.minYear!);
      }

      if (filters.maxYear !== undefined && filters.maxYear > 0) {
        result = result.filter(v => v.year <= filters.maxYear!);
      }

      if (filters.maxMileage !== undefined && filters.maxMileage > 0) {
        result = result.filter(v => v.mileage <= filters.maxMileage!);
      }

      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            result.sort((a, b) => b.year - a.year);
            break;
          case 'price_asc':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            result.sort((a, b) => b.price - a.price);
            break;
          case 'mileage_asc':
            result.sort((a, b) => a.mileage - b.mileage);
            break;
        }
      }
    }

    return result;
  },
  
  async fetchVehiclesLive(): Promise<Vehicle[]> {
    const client = supabaseAdmin || supabase;
    if (client) {
      try {
        const { data, error } = await client
          .from('vehicles')
          .select(`
            *,
            make:makes(*),
            model:models(*),
            images:vehicle_images(*)
          `)
          .in('status', ['AVAILABLE', 'RESERVED', 'SOLD']);

        if (!error && data && data.length > 0) {
          vehiclesCache = data as Vehicle[];
          return vehiclesCache;
        }
      } catch (e) {
        console.error('Supabase fetchVehicles error:', e);
      }
    }
    return [...vehiclesCache];
  },

  async fetchMakesLive(): Promise<Make[]> {
    const client = supabaseAdmin || supabase;
    if (client) {
      try {
        const { data, error } = await client
          .from('makes')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          makesCache = data as Make[];
          return makesCache;
        }
      } catch (e) {
        console.error('Supabase fetchMakes error:', e);
      }
    }
    return [...makesCache];
  },

  getAllVehiclesAdmin(): Vehicle[] {
    return [...vehiclesCache];
  },

  getVehicleBySlug(slug: string): Vehicle | undefined {
    return vehiclesCache.find(v => v.slug === slug);
  },

  getVehicleById(id: string): Vehicle | undefined {
    return vehiclesCache.find(v => v.id === id || v.slug === id);
  },

  getFeaturedVehicles(): Vehicle[] {
    return vehiclesCache.filter(v => v.is_featured && v.status === 'AVAILABLE');
  },

  getNewArrivals(): Vehicle[] {
    return vehiclesCache.filter(v => v.is_new_arrival && v.status === 'AVAILABLE');
  },

  getHotDeals(): Vehicle[] {
    return vehiclesCache.filter(v => v.is_hot_deal && v.status === 'AVAILABLE');
  },

  addVehicle(vehicle: Omit<Vehicle, 'id'> & { id?: string }): Vehicle {
    const id = vehicle.id || `v-${Date.now()}`;
    const make = makesCache.find(m => m.id === vehicle.make_id);
    const model = modelsCache.find(m => m.id === vehicle.model_id);
    
    const newVehicle: Vehicle = {
      ...vehicle,
      id,
      make,
      model,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    vehiclesCache.unshift(newVehicle);
    return newVehicle;
  },

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | undefined {
    const idx = vehiclesCache.findIndex(v => v.id === id || v.slug === id);
    if (idx === -1) return undefined;

    const make = updates.make_id ? makesCache.find(m => m.id === updates.make_id) : vehiclesCache[idx].make;
    const model = updates.model_id ? modelsCache.find(m => m.id === updates.model_id) : vehiclesCache[idx].model;

    vehiclesCache[idx] = {
      ...vehiclesCache[idx],
      ...updates,
      make,
      model,
      updated_at: new Date().toISOString(),
    };

    return vehiclesCache[idx];
  },

  deleteVehicle(id: string): boolean {
    const initialLen = vehiclesCache.length;
    vehiclesCache = vehiclesCache.filter(v => v.id !== id && v.slug !== id);
    return vehiclesCache.length < initialLen;
  },

  // --- MAKES & MODELS ---
  getMakes(): Make[] {
    return [...makesCache].sort((a, b) => a.sort_order - b.sort_order);
  },

  getModelsByMake(makeId: string): Model[] {
    return modelsCache.filter(m => m.make_id === makeId);
  },

  // --- LEADS & ENQUIRIES ---
  getLeads(): Lead[] {
    return [...leadsCache].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  createLead(data: Omit<Lead, 'id' | 'status' | 'created_at'>): Lead {
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      status: 'NEW',
      created_at: new Date().toISOString(),
    };
    leadsCache.unshift(newLead);
    return newLead;
  },

  updateLeadStatus(id: string, status: Lead['status']): Lead | undefined {
    const lead = leadsCache.find(l => l.id === id);
    if (lead) lead.status = status;
    return lead;
  },

  // --- FINANCE LEADS ---
  getFinanceLeads(): FinanceLead[] {
    return [...financeLeadsCache].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  createFinanceLead(data: Omit<FinanceLead, 'id' | 'status' | 'created_at'>): FinanceLead {
    const newFinLead: FinanceLead = {
      ...data,
      id: `fin-${Date.now()}`,
      status: 'NEW',
      created_at: new Date().toISOString(),
    };
    financeLeadsCache.unshift(newFinLead);
    return newFinLead;
  },

  updateFinanceLeadStatus(id: string, status: FinanceLead['status']): FinanceLead | undefined {
    const lead = financeLeadsCache.find(l => l.id === id);
    if (lead) lead.status = status;
    return lead;
  },

  // --- SELL CAR REQUESTS ---
  getSellCarRequests(): SellCarRequest[] {
    return [...sellCarCache].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  createSellCarRequest(data: Omit<SellCarRequest, 'id' | 'status' | 'created_at'>): SellCarRequest {
    const newReq: SellCarRequest = {
      ...data,
      id: `sell-${Date.now()}`,
      status: 'NEW',
      created_at: new Date().toISOString(),
    };
    sellCarCache.unshift(newReq);
    return newReq;
  },

  updateSellCarStatus(id: string, status: SellCarRequest['status']): SellCarRequest | undefined {
    const req = sellCarCache.find(r => r.id === id);
    if (req) req.status = status;
    return req;
  },

  // --- SITE SETTINGS ---
  getSiteSettings(): SiteSettings {
    return { ...siteSettingsCache };
  },

  updateSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
    siteSettingsCache = { ...siteSettingsCache, ...settings };
    return { ...siteSettingsCache };
  },

  // --- CSV IMPORT UTILITY (TRD Section 21) ---
  importVehiclesCSV(csvContent: string): { total: number; valid: number; failed: number; errors: string[] } {
    const lines = csvContent.trim().split(/\r?\n/);
    if (lines.length < 2) {
      return { total: 0, valid: 0, failed: 0, errors: ["CSV file is empty or missing data rows."] };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['make', 'model', 'year', 'price', 'mileage', 'fuel_type', 'transmission', 'body_type'];
    const missing = requiredHeaders.filter(rh => !headers.includes(rh));

    if (missing.length > 0) {
      return { total: 0, valid: 0, failed: 0, errors: [`Missing required columns: ${missing.join(', ')}`] };
    }

    let validCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(',').map(c => c.trim());
      const rowData: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowData[h] = cols[idx] || '';
      });

      try {
        const makeName = rowData['make'];
        const modelName = rowData['model'];
        const year = parseInt(rowData['year'], 10);
        const price = parseFloat(rowData['price']);
        const mileage = parseInt(rowData['mileage'], 10);
        const fuel = (rowData['fuel_type'] || 'PETROL').toUpperCase() as FuelType;
        const trans = (rowData['transmission'] || 'MANUAL').toUpperCase() as TransmissionType;
        const body = (rowData['body_type'] || 'SEDAN').toUpperCase() as BodyType;

        if (!makeName || !modelName || isNaN(year) || isNaN(price) || isNaN(mileage)) {
          failedCount++;
          errors.push(`Row ${i + 1}: Invalid data for make/model/year/price/mileage`);
          continue;
        }

        let makeObj = makesCache.find(m => m.name.toLowerCase() === makeName.toLowerCase());
        if (!makeObj) {
          makeObj = {
            id: `m-${Date.now()}-${i}`,
            name: makeName,
            slug: makeName.toLowerCase().replace(/\s+/g, '-'),
            is_active: true,
            sort_order: makesCache.length + 1,
          };
          makesCache.push(makeObj);
        }

        let modelObj = modelsCache.find(m => m.make_id === makeObj!.id && m.name.toLowerCase() === modelName.toLowerCase());
        if (!modelObj) {
          modelObj = {
            id: `mod-${Date.now()}-${i}`,
            make_id: makeObj.id,
            name: modelName,
            slug: modelName.toLowerCase().replace(/\s+/g, '-'),
            is_active: true,
          };
          modelsCache.push(modelObj);
        }

        const stockNum = `NSCB-CSV-${Date.now().toString().slice(-4)}-${i}`;
        const slug = `${makeName.toLowerCase()}-${modelName.toLowerCase()}-${year}-${Date.now().toString().slice(-4)}`;

        const newCar: Vehicle = {
          id: `v-csv-${Date.now()}-${i}`,
          stock_number: stockNum,
          slug,
          make_id: makeObj.id,
          model_id: modelObj.id,
          make: makeObj,
          model: modelObj,
          variant: rowData['variant'] || 'Standard',
          year,
          price,
          mileage,
          fuel_type: fuel,
          transmission: trans,
          body_type: body,
          color: rowData['color'] || 'White',
          registration_number: rowData['registration_number'] || 'UP 32 XX 0000',
          rto_state: 'UP',
          ownership: '1st Owner',
          description: rowData['description'] || `${year} ${makeName} ${modelName} in excellent condition, inspected by New Sai Car Bazar.`,
          features: ["Air Conditioning", "Power Windows", "Central Locking", "Alloy Wheels"],
          status: 'AVAILABLE',
          is_featured: false,
          is_new_arrival: true,
          is_hot_deal: false,
          images: [
            {
              id: `img-csv-${Date.now()}-${i}`,
              vehicle_id: `v-csv-${Date.now()}-${i}`,
              storage_path: 'csv-imports/car.webp',
              image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
              alt_text: `${makeName} ${modelName}`,
              sort_order: 0,
              is_primary: true,
            }
          ]
        };

        vehiclesCache.unshift(newCar);
        validCount++;
      } catch (err: any) {
        failedCount++;
        errors.push(`Row ${i + 1}: ${err.message || 'Parse error'}`);
      }
    }

    return {
      total: lines.length - 1,
      valid: validCount,
      failed: failedCount,
      errors,
    };
  },

  // --- AGREEMENTS / DEEDS ---
  getAgreements(params?: { type?: string; rc_status?: string; search?: string }): Agreement[] {
    let result = [...getAgreementsCache()];
    if (params?.type) {
      result = result.filter(a => a.deed_type === params.type);
    }
    if (params?.rc_status) {
      result = result.filter(a => a.rc_transfer_status === params.rc_status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(a =>
        a.party_name?.toLowerCase().includes(q) ||
        a.party_mobile?.includes(q) ||
        a.reg_number?.toLowerCase().includes(q) ||
        a.make_model?.toLowerCase().includes(q) ||
        a.deed_number?.toLowerCase().includes(q)
      );
    }
    return result;
  },

  getAgreementById(id: string): Agreement | undefined {
    return getAgreementsCache().find(a => a.id === id);
  },

  createAgreement(data: Partial<Agreement>): Agreement {
    const list = getAgreementsCache();
    const prefix = data.deed_type === "PURCHASE" ? "NSCB-KRAY" : "NSCB-VIKRAY";
    const year = new Date().getFullYear();
    const count = list.filter(a => a.deed_type === data.deed_type).length + 1;
    const num = String(count).padStart(3, "0");
    const deed_number = data.deed_number || `${prefix}-${year}-${num}`;

    const newAgreement: Agreement = {
      id: data.id || `agr-${Date.now()}`,
      deed_type: data.deed_type || "SALE",
      deed_number,
      deed_date: data.deed_date || new Date().toISOString().slice(0, 10),
      party_name: data.party_name || "",
      party_relation_type: data.party_relation_type || "पुत्र",
      party_relation_name: data.party_relation_name || "",
      party_address: data.party_address || "",
      party_mobile: data.party_mobile || "",
      party_id_type: data.party_id_type || "Aadhaar",
      party_id_number: data.party_id_number || "",
      vehicle_id: data.vehicle_id,
      make_model: data.make_model || "",
      variant: data.variant,
      color: data.color,
      mfg_year: data.mfg_year,
      reg_year: data.reg_year,
      reg_number: data.reg_number || "",
      fuel_type: data.fuel_type || "PETROL",
      chassis_number: data.chassis_number,
      engine_number: data.engine_number,
      odometer_reading: data.odometer_reading,
      reg_rto: data.reg_rto,
      insurance_policy_no: data.insurance_policy_no,
      insurance_validity: data.insurance_validity,
      puc_number: data.puc_number,
      puc_validity: data.puc_validity,
      total_price: data.total_price || 0,
      total_price_words: data.total_price_words || "",
      advance_amount: data.advance_amount || 0,
      advance_receipt_no: data.advance_receipt_no,
      balance_amount: data.balance_amount || 0,
      payment_mode_1: data.payment_mode_1,
      payment_ref_1: data.payment_ref_1,
      payment_date_1: data.payment_date_1,
      payment_place_1: data.payment_place_1,
      rc_transfer_status: data.rc_transfer_status || "PENDING",
      form29_received: data.form29_received || false,
      form30_received: data.form30_received || false,
      rc_transfer_date: data.rc_transfer_date,
      rto_receipt_no: data.rto_receipt_no,
      notes: data.notes,
      witness1_name: data.witness1_name,
      witness1_address: data.witness1_address,
      witness1_mobile: data.witness1_mobile,
      witness2_name: data.witness2_name,
      witness2_address: data.witness2_address,
      witness2_mobile: data.witness2_mobile,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    list.unshift(newAgreement);
    setAgreementsCache(list);
    return newAgreement;
  },

  updateAgreement(id: string, updates: Partial<Agreement>): Agreement | undefined {
    const list = getAgreementsCache();
    const index = list.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    list[index] = {
      ...list[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    setAgreementsCache(list);
    return list[index];
  },

  deleteAgreement(id: string): boolean {
    const list = getAgreementsCache();
    const before = list.length;
    const filtered = list.filter(a => a.id !== id);
    setAgreementsCache(filtered);
    return filtered.length < before;
  },
};
