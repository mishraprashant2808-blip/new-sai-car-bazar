"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";

interface Agreement {
  id: string;
  deed_type: "PURCHASE" | "SALE";
  deed_number: string;
  deed_date: string;
  party_name: string;
  party_relation_type: string;
  party_relation_name: string;
  party_address: string;
  party_mobile: string;
  party_id_type: string;
  party_id_number: string;
  make_model: string;
  variant: string;
  color: string;
  mfg_year: number;
  reg_year: number;
  reg_number: string;
  fuel_type: string;
  chassis_number: string;
  engine_number: string;
  odometer_reading: number;
  reg_rto: string;
  insurance_policy_no: string;
  insurance_validity: string;
  puc_number: string;
  puc_validity: string;
  total_price: number;
  total_price_words: string;
  advance_amount: number;
  advance_receipt_no: string;
  balance_amount: number;
  payment_mode_1: string;
  payment_ref_1: string;
  payment_date_1: string;
  payment_place_1: string;
  witness1_name: string;
  witness1_address: string;
  witness1_mobile: string;
  witness2_name: string;
  witness2_address: string;
  witness2_mobile: string;
  notes: string;
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}

function formatDate(d: string) {
  if (!d) return "____/____________/20____";
  const dt = new Date(d);
  const day = String(dt.getDate()).padStart(2, "0");
  const months = ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"];
  return `${day} / ${months[dt.getMonth()]} / ${dt.getFullYear()}`;
}

const GSTIN = "09FOPPM0583G1ZG";
const DEALER_ADDR = "टाटा मोटर्स, काले सरदार के पास, नवाबगंज, बाराबंकी, उत्तर प्रदेश – 225001";
const DEALER_NAME = "M/s NEW SAI CAR BAZAR";
const OWNER_NAME = "श्री दिनेश कुमार मिश्रा";

function Row({ label, value }: { label: string; value?: string | number }) {
  return (
    <tr className="border border-black">
      <td className="border border-black px-3 py-1.5 text-sm font-bold bg-gray-100 text-black w-64">{label}</td>
      <td className="border border-black px-3 py-1.5 text-sm font-semibold min-h-[32px] text-black">{value ?? ""}</td>
    </tr>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-title bg-gray-900 text-white text-center py-1.5 px-4 text-sm font-bold tracking-wide mt-5 mb-0">
      {children}
    </div>
  );
}

export default function PrintDeedPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDeed = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/agreements/${params.id}`);
      const json = await res.json();
      setData(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { fetchDeed(); }, [fetchDeed]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div className="text-gray-700 text-sm font-semibold">Loading deed…</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="text-center text-red-600 font-bold">
          Deed not found.
          <div className="mt-4">
            <Link href="/admin/deeds" className="text-sm underline text-blue-600">Return to Deeds List</Link>
          </div>
        </div>
      </div>
    );
  }

  const isSale = data.deed_type === "SALE";

  return (
    <div className="min-h-screen bg-gray-300 py-4">
      {/* Print Controls Bar — hidden when printing */}
      <div className="print:hidden sticky top-0 z-50 max-w-4xl mx-auto mb-4 bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <Link href="/admin/deeds" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="text-gray-500">|</span>
          <span className="text-sm font-bold text-white">{data.deed_number}</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold text-white ${isSale ? "bg-rose-600" : "bg-purple-600"}`}>
            {isSale ? "विक्रय विलेख (Sale Deed)" : "क्रय विलेख (Purchase Deed)"}
          </span>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#ED0000] hover:bg-red-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition shadow-lg cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF (A4)
        </button>
      </div>

      {/* A4 Page Container */}
      <div
        className="deed-container mx-auto my-4 print:my-0 bg-white text-black shadow-2xl print:shadow-none p-10 print:p-0"
        style={{ width: "210mm", minHeight: "297mm", color: "#000000", backgroundColor: "#ffffff" }}
      >
        <style>{`
          @media print {
            @page { size: A4; margin: 10mm 12mm; }
            body { background: #ffffff !important; color: #000000 !important; }
            .print\\:hidden { display: none !important; }
          }
          .deed-container {
            color: #000000 !important;
            background-color: #ffffff !important;
            font-family: 'Noto Sans Devanagari', 'Mangal', 'Arial Unicode MS', sans-serif;
          }
          .deed-container p,
          .deed-container span,
          .deed-container div,
          .deed-container td,
          .deed-container th {
            color: #000000 !important;
          }
          .deed-container .deed-header-dark,
          .deed-container .deed-header-dark * {
            color: #ffffff !important;
            background-color: #111827 !important;
          }
          .deed-container .section-title,
          .deed-container .section-title * {
            color: #ffffff !important;
            background-color: #1f2937 !important;
          }
        `}</style>

        {/* ═══════════ HEADER ═══════════ */}
        <div className="border-2 border-black mb-1">
          <div className="deed-header-dark text-center border-b-2 border-black py-2.5 bg-gray-900">
            <div className="text-2xl font-black text-white tracking-widest uppercase">{DEALER_NAME}</div>
          </div>
          <div className="text-center py-2 px-4 bg-white text-black">
            <div className="text-sm font-bold text-black">{DEALER_ADDR}</div>
            <div className="text-sm font-bold mt-0.5 text-black">
              <span>GSTIN:</span> {GSTIN}
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span>मो.:</span> 7007655230 / 8528886630
            </div>
          </div>
        </div>

        {/* ═══════════ DEED TITLE ═══════════ */}
        <div className="text-center border-2 border-black border-t-0 py-2.5 bg-amber-50 mb-5 text-black">
          <div className="text-xl font-black underline underline-offset-4 tracking-wide text-black">
            {isSale ? "मोटर वाहन विक्रय विलेख" : "मोटर वाहन क्रय विलेख"}
          </div>
          <div className="text-xs text-gray-800 font-semibold mt-0.5">
            {isSale
              ? "(डीलर से ग्राहक — स्टॉक-इन-ट्रेड से विक्रय)"
              : "(व्यक्तिगत विक्रेता से डीलर — स्टॉक-इन-ट्रेड हेतु क्रय)"}
          </div>
          <div className="flex justify-between text-xs text-black font-bold mt-1.5 px-8">
            <span><span>विलेख सं.:</span> {data.deed_number}</span>
            <span><span>दिनांक:</span> {formatDate(data.deed_date)}</span>
          </div>
        </div>

        {/* ═══════════ INTRO ═══════════ */}
        <p className="text-sm text-black text-justify leading-relaxed mb-4 indent-8 font-medium">
          यह विलेख आज दिनांक{" "}
          <span className="font-bold underline text-black">{formatDate(data.deed_date)}</span>
          {" "}को बाराबंकी, उत्तर प्रदेश में निम्नलिखित पक्षों के मध्य निष्पादित किया गया है:
        </p>

        {/* ═══════════ SELLER PARTY ═══════════ */}
        <SectionTitle>{isSale ? "विक्रेता (डीलर) / SELLER (Dealer)" : "विक्रेता (व्यक्तिगत वाहन स्वामी) / SELLER"}</SectionTitle>
        {isSale ? (
          <div className="border border-black border-t-0 p-3 text-sm leading-relaxed bg-gray-50 text-black font-medium">
            <span className="font-bold text-black">{DEALER_NAME}</span>, एकल स्वामित्व व्यवसाय, पुराने मोटर वाहनों के क्रय-विक्रय में संलग्न,
            पता: {DEALER_ADDR}, GSTIN {GSTIN},{" "}
            के स्वामी <span className="font-bold text-black">{OWNER_NAME}</span> पुत्र _____________________, निवासी ________________________________________।
            <div className="text-xs text-gray-700 mt-1 italic">(इन्हें आगे "विक्रेता" कहा जाएगा।)</div>
          </div>
        ) : (
          <table className="w-full border-collapse border-t-0 text-black">
            <tbody>
              <Row label="नाम, पुत्र/पुत्री/पत्नी" value={`${data.party_name}, ${data.party_relation_type} ${data.party_relation_name || "___________"}`} />
              <Row label="स्थायी पता" value={data.party_address} />
              <Row label="मोबाइल नं." value={data.party_mobile} />
              <Row label={`पहचान-पत्र (${data.party_id_type}) नं.`} value={data.party_id_number} />
            </tbody>
          </table>
        )}

        {/* ═══════════ BUYER PARTY ═══════════ */}
        <SectionTitle>{isSale ? "क्रेता (ग्राहक) / BUYER (Customer)" : "क्रेता (डीलर) / BUYER (Dealer)"}</SectionTitle>
        {!isSale ? (
          <div className="border border-black border-t-0 p-3 text-sm leading-relaxed bg-gray-50 text-black font-medium">
            <span className="font-bold text-black">{DEALER_NAME}</span>, एकल स्वामित्व व्यवसाय, पुराने मोटर वाहनों के क्रय-विक्रय में संलग्न,
            पता: {DEALER_ADDR}, GSTIN {GSTIN},{" "}
            के स्वामी <span className="font-bold text-black">{OWNER_NAME}</span> पुत्र _____________________, निवासी ________________________________________।
            <div className="text-xs text-gray-700 mt-1 italic">(इन्हें आगे "क्रेता" कहा जाएगा।)</div>
          </div>
        ) : (
          <table className="w-full border-collapse border-t-0 text-black">
            <tbody>
              <Row label="नाम, पुत्र/पुत्री/पत्नी" value={`${data.party_name}, ${data.party_relation_type} ${data.party_relation_name || "___________"}`} />
              <Row label="स्थायी पता" value={data.party_address} />
              <Row label="मोबाइल नं." value={data.party_mobile} />
              <Row label={`पहचान-पत्र (${data.party_id_type}) नं.`} value={data.party_id_number} />
            </tbody>
          </table>
        )}

        {/* ═══════════ VEHICLE DETAILS ═══════════ */}
        <SectionTitle>वाहन विवरण / VEHICLE DETAILS</SectionTitle>
        <table className="w-full border-collapse border-t-0 text-black">
          <tbody>
            <Row label="मेक एवं मॉडल" value={`${data.make_model}${data.variant ? " " + data.variant : ""}`} />
            <Row label="रंग / Color" value={data.color} />
            <Row label="निर्माण / पंजीकरण वर्ष" value={`${data.mfg_year || ""}  /  ${data.reg_year || ""}`} />
            <Row label="पंजीकरण सं." value={data.reg_number} />
            <Row label="ईंधन प्रकार" value={data.fuel_type} />
            <Row label="चेसिस नं. (पूर्ण)" value={data.chassis_number} />
            <Row label="इंजन नं. (पूर्ण)" value={data.engine_number} />
            <Row label="ओडोमीटर रीडिंग (km)" value={data.odometer_reading ? `${data.odometer_reading.toLocaleString("en-IN")} km` : ""} />
            <Row label="पंजीयन RTO" value={data.reg_rto} />
            <Row label="बीमा पॉलिसी नं. एवं वैधता" value={[data.insurance_policy_no, data.insurance_validity].filter(Boolean).join("  —  ")} />
            <Row label="PUC प्रमाण-पत्र नं. एवं वैधता" value={[data.puc_number, data.puc_validity].filter(Boolean).join("  —  ")} />
          </tbody>
        </table>

        {/* ═══════════ FINANCIAL DETAILS ═══════════ */}
        <SectionTitle>प्रतिफल (Consideration) / FINANCIAL DETAILS</SectionTitle>
        <table className="w-full border-collapse border-t-0 text-black">
          <tbody>
            <Row label={`कुल ${isSale ? "विक्रय" : "क्रय"} मूल्य (अंकों में)`} value={formatINR(data.total_price)} />
            <Row label="कुल मूल्य (शब्दों में)" value={data.total_price_words} />
            {isSale && data.advance_amount > 0 && (
              <Row label="अग्रिम राशि एवं रसीद नं." value={`${formatINR(data.advance_amount)}  —  ${data.advance_receipt_no || ""}`} />
            )}
            {isSale && (
              <Row label="शेष राशि एवं माध्यम" value={`${formatINR(data.balance_amount)}  —  ${data.payment_mode_1 || ""}${data.payment_ref_1 ? " / " + data.payment_ref_1 : ""}`} />
            )}
            {!isSale && (
              <Row label="भुगतान का माध्यम / Ref. नं." value={`${data.payment_mode_1 || ""}  ${data.payment_ref_1 ? "/ " + data.payment_ref_1 : ""}`} />
            )}
            <Row label="भुगतान दिनांक एवं स्थान" value={`${data.payment_date_1 ? formatDate(data.payment_date_1) : ""}  —  ${data.payment_place_1 || ""}`} />
          </tbody>
        </table>

        {/* ═══════════ TERMS & CONDITIONS ═══════════ */}
        <SectionTitle>शर्तें एवं अनुबंध / TERMS & CONDITIONS</SectionTitle>
        <div className="border border-black border-t-0 p-4 text-xs leading-relaxed space-y-2 text-black font-normal bg-white">
          {isSale ? (
            <>
              <p><span className="font-bold">1. स्वामित्व हस्तांतरण:</span> उपर्युक्त प्रतिफल के एवज में विक्रेता वाहन में अपना समस्त अधिकार, स्वत्व एवं हित, मूल RC, चाबियाँ, सहायक उपकरण सहित, समस्त भारों से मुक्त करके क्रेता को हस्तांतरित करता है।</p>
              <p><span className="font-bold">2. "जैसा है जहाँ है" आधार:</span> वाहन बिना किसी वारंटी के "AS IS WHERE IS" आधार पर बेचा जा रहा है। क्रेता ने स्वयं निरीक्षण एवं टेस्ट-ड्राइव के बाद अपने विवेक पर खरीदा है।</p>
              <p><span className="font-bold">3. सुपुर्दगी:</span> वाहन का कब्जा इस विलेख के निष्पादन के साथ-साथ डिलीवरी नोट के अनुसार क्रेता को दे दिया गया है।</p>
              <p><span className="font-bold">4. जोखिम एवं दायित्व का हस्तांतरण:</span> डिलीवरी की तिथि एवं समय से वाहन संबंधी समस्त जोखिम, ई-चालान, FASTag बकाया, कर, बीमा एवं दायित्व क्रेता पर स्थानांतरित हो जाएगा — भले ही RTO में स्वामित्व हस्तांतरण पूर्ण न हुआ हो।</p>
              <p><span className="font-bold">5. RC पंजीकरण का वचन:</span> क्रेता डिलीवरी की तिथि से <span className="font-bold underline">30 दिनों के भीतर</span> Form 30 एवं Form 29 सहित समस्त दस्तावेज संबंधित RTO में जमा करेगा/करेगी और विक्रेता को RTO पावती की प्रति उपलब्ध कराएगा/कराएगी।</p>
              <p><span className="font-bold">6. विलंब पर दंड:</span> यदि क्रेता निर्धारित अवधि में पंजीकरण हस्तांतरण नहीं कराता, तो विक्रेता को प्रतिदिन ₹500/- (रुपये पाँच सौ मात्र) की संविदात्मक क्षति मिलेगी।</p>
              <p><span className="font-bold">7. क्षतिपूर्ति:</span> क्रेता, डिलीवरी की तिथि के पश्चात् वाहन के उपयोग से उत्पन्न किसी भी हानि, चालान, कर-माँग या कार्यवाही के विरुद्ध विक्रेता को क्षतिपूर्ति देगा/देगी।</p>
              <p><span className="font-bold">8. सम्पूर्ण करार:</span> यह विलेख, समदिनांकित कर-चालान एवं डिलीवरी नोट के साथ, वाहन के विक्रय संबंधी पक्षों के मध्य संपूर्ण करार है।</p>
              <p><span className="font-bold">9. न्यायिक क्षेत्र:</span> इस विलेख से उत्पन्न किसी भी विवाद पर केवल बाराबंकी, उत्तर प्रदेश के न्यायालयों का अधिकार क्षेत्र होगा।</p>
            </>
          ) : (
            <>
              <p><span className="font-bold">1. विक्रेता की घोषणा:</span> विक्रेता घोषित करता/करती है कि वह वाहन का एकमात्र पंजीकृत स्वामी है; वाहन किसी हाइपोथिकेशन, ऋण, कोर्ट-ऑर्डर, जब्ती या आपराधिक कार्यवाही से मुक्त है; और वाहन चोरी-शुदा या खोया हुआ नहीं है।</p>
              <p><span className="font-bold">2. स्वामित्व हस्तांतरण:</span> उपर्युक्त प्रतिफल की प्राप्ति पर, विक्रेता वाहन में अपना समस्त अधिकार, स्वत्व एवं हित, मूल RC, वैध बीमा, PUC, सभी चाबियाँ, सर्विस रिकॉर्ड सहित, समस्त भारों से मुक्त करके क्रेता को हस्तांतरित करता/करती है।</p>
              <p><span className="font-bold">3. सुपुर्दगी:</span> वाहन का कब्जा एवं उक्त दस्तावेज इस विलेख के निष्पादन के साथ-साथ क्रेता को सौंप दिए गए हैं।</p>
              <p><span className="font-bold">4. पूर्व-सुपुर्दगी दायित्व से क्षतिपूर्ति:</span> सुपुर्दगी की तिथि से पूर्व की किसी भी चालान, कर-माँग, दुर्घटना दावे या अन्य देयता के लिए विक्रेता उत्तरदायी रहेगा/रहेगी और क्रेता को पूर्ण क्षतिपूर्ति देगा/देगी।</p>
              <p><span className="font-bold">5. पुनर्विक्रय का अधिकार:</span> क्रेता वाहन को अपने व्यापारिक स्टॉक के रूप में पुनर्निर्मित, प्रदर्शित एवं किसी भी तृतीय पक्ष को पुनर्विक्रय करने का अधिकार रखता है।</p>
              <p><span className="font-bold">6. Form 29:</span> विक्रेता ने इस विलेख के साथ-साथ Form 29 हस्ताक्षरित करके क्रेता को सौंप दिया है ताकि मोटर वाहन अधिनियम, 1988 की धारा 50 के अंतर्गत RTO में पंजीकरण हस्तांतरण पूर्ण किया जा सके।</p>
              <p><span className="font-bold">7. कोई आगे का दावा नहीं:</span> उपर्युक्त प्रतिफल प्राप्त होने पर विक्रेता का वाहन में कोई और दावा, बंधक या हित नहीं रहेगा।</p>
              <p><span className="font-bold">8. सम्पूर्ण करार:</span> यह विलेख पक्षों के मध्य वाहन के क्रय संबंधी संपूर्ण करार है।</p>
              <p><span className="font-bold">9. न्यायिक क्षेत्र:</span> इस विलेख से उत्पन्न किसी भी विवाद पर केवल बाराबंकी, उत्तर प्रदेश के न्यायालयों का अधिकार क्षेत्र होगा।</p>
            </>
          )}
        </div>

        {/* ═══════════ SIGNATURES ═══════════ */}
        <div className="mt-8 border-2 border-black text-black">
          <div className="deed-header-dark bg-gray-900 text-white text-center py-1 text-sm font-bold">हस्ताक्षर / SIGNATURES</div>
          <div className="grid grid-cols-2 divide-x divide-black bg-white">
            {/* Seller */}
            <div className="p-4 space-y-6">
              <div className="text-xs font-black uppercase text-gray-800 text-center">
                {isSale ? "विक्रेता / SELLER" : "विक्रेता / SELLER"}
                {isSale ? <div className="text-gray-600 font-normal normal-case">(M/s New Sai Car Bazar के लिए)</div> : null}
              </div>
              <div className="space-y-3">
                <div className="border-b border-black pb-1">
                  <div className="text-xs text-gray-600 font-semibold">नाम:</div>
                  <div className="text-sm font-bold text-black mt-1 min-h-[20px]">{isSale ? OWNER_NAME : data.party_name}</div>
                </div>
                <div className="border-b border-black pb-1">
                  <div className="text-xs text-gray-600 font-semibold">दिनांक:</div>
                  <div className="text-sm font-bold text-black mt-1 min-h-[20px]">{formatDate(data.deed_date)}</div>
                </div>
                <div className="border-b border-black pb-1">
                  <div className="text-xs text-gray-600 font-semibold">हस्ताक्षर / Signature:</div>
                  <div className="min-h-[40px]" />
                </div>
              </div>
            </div>
            {/* Buyer */}
            <div className="p-4 space-y-6">
              <div className="text-xs font-black uppercase text-gray-800 text-center">
                {isSale ? "क्रेता / BUYER" : "क्रेता / BUYER"}
                {!isSale ? <div className="text-gray-600 font-normal normal-case">(M/s New Sai Car Bazar के लिए)</div> : null}
              </div>
              <div className="space-y-3">
                <div className="border-b border-black pb-1">
                  <div className="text-xs text-gray-600 font-semibold">नाम:</div>
                  <div className="text-sm font-bold text-black mt-1 min-h-[20px]">{!isSale ? OWNER_NAME : data.party_name}</div>
                </div>
                <div className="border-b border-black pb-1">
                  <div className="text-xs text-gray-600 font-semibold">दिनांक:</div>
                  <div className="text-sm font-bold text-black mt-1 min-h-[20px]">{formatDate(data.deed_date)}</div>
                </div>
                <div className="border-b border-black pb-1">
                  <div className="text-xs text-gray-600 font-semibold">हस्ताक्षर / Signature:</div>
                  <div className="min-h-[40px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Witnesses */}
          <div className="border-t-2 border-black bg-white">
            <div className="bg-gray-200 text-center py-1 text-xs font-bold uppercase text-black">साक्षीगण / WITNESSES</div>
            <div className="grid grid-cols-2 divide-x divide-black">
              {[
                { n: data.witness1_name, a: data.witness1_address, m: data.witness1_mobile, label: "साक्षी 1" },
                { n: data.witness2_name, a: data.witness2_address, m: data.witness2_mobile, label: "साक्षी 2" },
              ].map((w, i) => (
                <div key={i} className="p-4 text-black">
                  <div className="text-xs font-bold text-gray-800 mb-2">{w.label}</div>
                  <div className="text-xs space-y-1.5 font-medium text-black">
                    <div><span className="text-gray-600">नाम:</span> {w.n || "____________________________"}</div>
                    <div><span className="text-gray-600">पता:</span> {w.a || "____________________________"}</div>
                    <div><span className="text-gray-600">मोबाइल:</span> {w.m || "_________________"}</div>
                    <div className="mt-3 pt-2 border-t border-black"><span className="text-gray-600">हस्ताक्षर:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="mt-4 border border-black p-3 text-xs text-black bg-white">
            <span className="font-bold text-black">टिप्पणी / Notes: </span>{data.notes}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 text-center text-xs text-gray-700 border-t border-gray-400 pt-3">
          <div className="font-bold text-black">{DEALER_NAME} — GSTIN: {GSTIN}</div>
          <div className="text-black">{DEALER_ADDR}</div>
          <div className="mt-1 text-gray-500 text-[10px]">यह विलेख कम्प्यूटर द्वारा उत्पन्न है। / This deed is computer-generated.</div>
        </div>
      </div>
    </div>
  );
}
