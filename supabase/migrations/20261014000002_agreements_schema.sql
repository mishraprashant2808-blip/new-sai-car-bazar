-- ==============================================================================
-- New Sai Car Bazar - Agreements / Deeds Schema
-- Migration Version: 2.0 (14 October 2026)
-- Covers: मोटर वाहन क्रय विलेख (Purchase Deed) + मोटर वाहन विक्रय विलेख (Sale Deed)
-- GSTIN: 09FOPPM0583G1ZG
-- ==============================================================================

-- Deed type enum
CREATE TYPE deed_type AS ENUM ('PURCHASE', 'SALE');

-- RC Transfer tracking
CREATE TYPE rc_transfer_status AS ENUM ('PENDING', 'AT_RTO', 'COMPLETED');

-- Payment mode
CREATE TYPE payment_mode AS ENUM ('CASH', 'UPI', 'CHEQUE', 'NEFT', 'BANK_TRANSFER', 'CAR_LOAN');

-- ==============================================================================
-- AGREEMENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.agreements (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deed_type             deed_type NOT NULL,
    deed_number           VARCHAR(50) UNIQUE, -- Auto-generated: NSCB-PURCHASE-001 / NSCB-SALE-001
    deed_date             DATE NOT NULL DEFAULT CURRENT_DATE,

    -- ─── PARTY DETAILS ────────────────────────────────────────────────────────
    -- For PURCHASE deed: seller = individual, buyer = dealer (auto)
    -- For SALE deed:     seller = dealer (auto), buyer = customer

    -- Individual party (seller in PURCHASE, buyer in SALE)
    party_name            TEXT NOT NULL,          -- पूरा नाम
    party_relation_type   TEXT,                   -- पुत्र / पुत्री / पत्नी
    party_relation_name   TEXT,                   -- (of whom)
    party_address         TEXT NOT NULL,
    party_mobile          TEXT NOT NULL,
    party_id_type         TEXT,                   -- Aadhaar / DL / Passport
    party_id_number       TEXT,

    -- ─── VEHICLE DETAILS ──────────────────────────────────────────────────────
    vehicle_id            UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    make_model            TEXT NOT NULL,
    variant               TEXT,
    color                 TEXT,
    mfg_year              SMALLINT,
    reg_year              SMALLINT,
    reg_number            TEXT NOT NULL,
    fuel_type             TEXT,
    chassis_number        TEXT,
    engine_number         TEXT,
    odometer_reading      INT,
    reg_rto               TEXT,
    insurance_policy_no   TEXT,
    insurance_validity    TEXT,
    puc_number            TEXT,
    puc_validity          TEXT,

    -- ─── FINANCIAL DETAILS ────────────────────────────────────────────────────
    total_price           BIGINT NOT NULL,        -- in INR (rupees)
    total_price_words     TEXT NOT NULL,          -- शब्दों में
    advance_amount        BIGINT DEFAULT 0,
    advance_receipt_no    TEXT,
    balance_amount        BIGINT DEFAULT 0,
    payment_mode_1        payment_mode,
    payment_ref_1         TEXT,                   -- UPI Ref / Cheque No / NEFT UTR
    payment_date_1        TEXT,
    payment_place_1       TEXT,

    -- ─── RC TRANSFER TRACKING ─────────────────────────────────────────────────
    rc_transfer_status    rc_transfer_status NOT NULL DEFAULT 'PENDING',
    form29_received       BOOLEAN DEFAULT false,
    form30_received       BOOLEAN DEFAULT false,
    rc_transfer_date      DATE,
    rto_receipt_no        TEXT,
    notes                 TEXT,

    -- ─── WITNESS DETAILS ──────────────────────────────────────────────────────
    witness1_name         TEXT,
    witness1_address      TEXT,
    witness1_mobile       TEXT,
    witness2_name         TEXT,
    witness2_address      TEXT,
    witness2_mobile       TEXT,

    -- ─── META ─────────────────────────────────────────────────────────────────
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by            UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER agreements_updated_at
    BEFORE UPDATE ON public.agreements
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto deed number sequence
CREATE SEQUENCE IF NOT EXISTS purchase_deed_seq START 1;
CREATE SEQUENCE IF NOT EXISTS sale_deed_seq START 1;

-- Indexes for fast search by party mobile, reg number, and deed type
CREATE INDEX idx_agreements_party_mobile ON public.agreements(party_mobile);
CREATE INDEX idx_agreements_reg_number   ON public.agreements(reg_number);
CREATE INDEX idx_agreements_deed_type    ON public.agreements(deed_type);
CREATE INDEX idx_agreements_deed_date    ON public.agreements(deed_date DESC);
CREATE INDEX idx_agreements_rc_status    ON public.agreements(rc_transfer_status);

-- RLS: Only authenticated users (admin) can read/write
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on agreements"
ON public.agreements FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
