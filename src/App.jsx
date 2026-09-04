import React, { useState, useEffect, useMemo } from "react";
import {
  Phone, ShieldCheck, User, Bell, Clock, Users, SearchCheck, CheckCircle2,
  XCircle, IndianRupee, Wheat, Sprout, Leaf, Carrot, MapPin, Calendar as CalendarIcon,
  ChevronRight, ChevronLeft, QrCode, ArrowLeft, Home as HomeIcon, ClipboardList,
  LogOut, Filter, Plus, Minus, Check, X, AlertCircle, Languages, Store, Sparkles
} from "lucide-react";

/* ----------------------------- design tokens ----------------------------- */
const Tokens = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    :root{
      --forest:#234D35; --forest-light:#E4EEE6;
      --soil:#8B5E34; --soil-light:#F2E7D8;
      --gold:#D9A441; --gold-dark:#8A6417; --gold-light:#FBF0DA;
      --amber:#C97A25; --amber-light:#FBEAD3;
      --terracotta:#BC4B2E; --terracotta-light:#F8E1DA;
      --cream:#FBF6EA; --ink:#2A2320; --ink-soft:#6B5E52;
    }
    .font-head{ font-family:'Baloo 2', ui-rounded, system-ui, sans-serif; }
    .font-body{ font-family:'Inter', system-ui, sans-serif; }
    .ticket{ position:relative; }
    .ticket::after{
      content:''; position:absolute; right:-1px; top:0; bottom:0; width:14px;
      background-image: radial-gradient(circle 3.5px, var(--cream) 3.5px, transparent 3.6px);
      background-size: 14px 16px; background-position: -7px -4px;
    }
    .scrollbar-none::-webkit-scrollbar{ display:none; }
    .scrollbar-none{ -ms-overflow-style:none; scrollbar-width:none; }
    @keyframes pulseDot { 0%,100%{ opacity:1; } 50%{ opacity:.35; } }
    .pulse-dot{ animation: pulseDot 1.4s ease-in-out infinite; }
  `}</style>
);

/* ------------------------------ translations ------------------------------ */
const T = {
  appName: { en: "Kisan Setu", hi: "किसान सेतु" },
  tagline: { en: "Farmer–Procurement Bridge", hi: "किसान-खरीद सेतु" },
  phoneLabel: { en: "Mobile number", hi: "मोबाइल नंबर" },
  sendOtp: { en: "Send OTP", hi: "OTP भेजें" },
  otpSentTo: { en: "OTP sent to", hi: "OTP भेजा गया" },
  enterOtp: { en: "Enter 4-digit OTP", hi: "4 अंकों का OTP डालें" },
  otpHint: { en: "Use 1234 for this demo", hi: "डेमो के लिए 1234 डालें" },
  verifyLogin: { en: "Verify & Login", hi: "सत्यापित करें और लॉगिन करें" },
  change: { en: "Change", hi: "बदलें" },
  home: { en: "Home", hi: "होम" },
  calendarNav: { en: "Calendar", hi: "कैलेंडर" },
  book: { en: "Book Slot", hi: "स्लॉट बुक करें" },
  officer: { en: "Officer", hi: "अधिकारी" },
  greeting: { en: "Namaste", hi: "नमस्ते" },
  myCrops: { en: "My Crop Batches", hi: "मेरी फसल खेप" },
  notifications: { en: "Notifications", hi: "सूचनाएं" },
  liveQueue: { en: "Live Queue", hi: "लाइव कतार" },
  farmersAhead: { en: "farmers ahead", hi: "किसान आगे हैं" },
  estWait: { en: "estimated wait", hi: "अनुमानित प्रतीक्षा" },
  viewStatus: { en: "View status", hi: "स्थिति देखें" },
  quickBook: { en: "Book a new slot", hi: "नया स्लॉट बुक करें" },
  quickCalendar: { en: "See procurement dates", hi: "खरीद तारीखें देखें" },
  noBatches: { en: "No crop batches yet. Book your first slot to get started.", hi: "अभी कोई फसल खेप नहीं है। शुरू करने के लिए स्लॉट बुक करें।" },
  qty: { en: "Qty", hi: "मात्रा" },
  quintal: { en: "quintals", hi: "क्विंटल" },
  token: { en: "Token", hi: "टोकन" },
  status_scheduled: { en: "Scheduled", hi: "निर्धारित" },
  status_in_queue: { en: "In Queue", hi: "कतार में" },
  status_under_inspection: { en: "Under Inspection", hi: "जांच जारी" },
  status_accepted: { en: "Accepted", hi: "स्वीकृत" },
  status_rejected: { en: "Rejected", hi: "अस्वीकृत" },
  status_payment_pending: { en: "Payment Pending", hi: "भुगतान बाकी" },
  status_paid: { en: "Paid", hi: "भुगतान हुआ" },
  calTitle: { en: "Procurement Calendar", hi: "खरीद कैलेंडर" },
  calSub: { en: "Plan ahead — see upcoming procurement dates before you travel", hi: "पहले से योजना बनाएं — यात्रा से पहले खरीद तारीखें देखें" },
  filterCrop: { en: "Crop", hi: "फसल" },
  filterDistrict: { en: "District", hi: "ज़िला" },
  filterMandi: { en: "Mandi Centre", hi: "मंडी केंद्र" },
  all: { en: "All", hi: "सभी" },
  slotsOpen: { en: "slots open", hi: "स्लॉट खाली" },
  full: { en: "Full", hi: "भरा हुआ" },
  bookThis: { en: "Book this slot", hi: "यह स्लॉट बुक करें" },
  noEvents: { en: "No procurement dates match this filter.", hi: "इस फ़िल्टर से कोई खरीद तारीख़ नहीं मिली।" },
  bookTitle: { en: "Book a Slot", hi: "स्लॉट बुक करें" },
  step1: { en: "1. Choose crop", hi: "1. फसल चुनें" },
  step2: { en: "2. Approx. quantity", hi: "2. अनुमानित मात्रा" },
  step3: { en: "3. Choose date & mandi", hi: "3. तारीख़ और मंडी चुनें" },
  next: { en: "Next", hi: "आगे" },
  back: { en: "Back", hi: "पीछे" },
  confirmBooking: { en: "Confirm Booking", hi: "बुकिंग पक्की करें" },
  chooseSlotFirst: { en: "Pick a date from the calendar tab, or choose below", hi: "कैलेंडर से तारीख़ चुनें, या नीचे से चुनें" },
  bookingConfirmed: { en: "Booking Confirmed!", hi: "बुकिंग पक्की हुई!" },
  showThisAtMandi: { en: "Show this token at the mandi gate", hi: "मंडी गेट पर यह टोकन दिखाएं" },
  yourToken: { en: "Your token number", hi: "आपका टोकन नंबर" },
  goToDashboard: { en: "Go to Dashboard", hi: "डैशबोर्ड पर जाएं" },
  trackTitle: { en: "Status Tracking", hi: "स्थिति ट्रैकिंग" },
  selectBatch: { en: "Select a batch", hi: "एक खेप चुनें" },
  submitted: { en: "Submitted", hi: "जमा हुआ" },
  queued: { en: "Queued", hi: "कतार में" },
  inspected: { en: "Inspected", hi: "जांचा गया" },
  decision: { en: "Accepted / Rejected", hi: "स्वीकृत / अस्वीकृत" },
  payment: { en: "Payment", hi: "भुगतान" },
  rejectionReason: { en: "Reason for rejection", hi: "अस्वीकृति का कारण" },
  gradeNote: { en: "Quality grade", hi: "गुणवत्ता श्रेणी" },
  adminTitle: { en: "Mandi Officer View", hi: "मंडी अधिकारी दृश्य" },
  todaysQueue: { en: "Today's Queue", hi: "आज की कतार" },
  checkIn: { en: "Check-in (start queue)", hi: "चेक-इन (कतार शुरू करें)" },
  startInspection: { en: "Start inspection", hi: "जांच शुरू करें" },
  accept: { en: "Accept", hi: "स्वीकार करें" },
  reject: { en: "Reject", hi: "अस्वीकार करें" },
  markPaid: { en: "Mark payment done", hi: "भुगतान पूर्ण करें" },
  sendToPayment: { en: "Send to payment", hi: "भुगतान हेतु भेजें" },
  reasonPlaceholder: { en: "e.g. Moisture too high", hi: "उदा. नमी अधिक है" },
  confirm: { en: "Confirm", hi: "पक्का करें" },
  cancel: { en: "Cancel", hi: "रद्द करें" },
  backToFarmer: { en: "Back to Farmer App", hi: "किसान ऐप पर वापस जाएं" },
  logout: { en: "Logout", hi: "लॉगआउट" },
  officerAccess: { en: "Mandi officer? Open Officer View", hi: "मंडी अधिकारी? अधिकारी दृश्य खोलें" },
  today: { en: "Today", hi: "आज" },
};
const useT = (lang) => (key) => (T[key] ? T[key][lang] : key);

/* --------------------------------- data --------------------------------- */
const CROPS = [
  { id: "wheat", en: "Wheat", hi: "गेहूं", Icon: Wheat },
  { id: "rice", en: "Rice", hi: "चावल", Icon: Sprout },
  { id: "cotton", en: "Cotton", hi: "कपास", Icon: Leaf },
  { id: "maize", en: "Maize", hi: "मक्का", Icon: Carrot },
];
const cropMeta = (id) => CROPS.find((c) => c.id === id) || CROPS[0];

const DISTRICTS = ["Karnal", "Kaithal", "Panipat"];
const MANDIS = {
  Karnal: ["Anaj Mandi Sector 12", "Rice Procurement Centre, Sadar"],
  Kaithal: ["Cotton Ginning Mandi"],
  Panipat: ["New Grain Market"],
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const fmtDate = (iso, lang) =>
  new Date(iso + "T00:00:00").toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });

const STATUS_META = {
  scheduled: { key: "status_scheduled", step: 0, fg: "var(--soil)", bg: "var(--soil-light)", Icon: Clock },
  in_queue: { key: "status_in_queue", step: 1, fg: "var(--gold-dark)", bg: "var(--gold-light)", Icon: Users },
  under_inspection: { key: "status_under_inspection", step: 2, fg: "var(--amber)", bg: "var(--amber-light)", Icon: SearchCheck },
  accepted: { key: "status_accepted", step: 3, fg: "var(--forest)", bg: "var(--forest-light)", Icon: CheckCircle2 },
  rejected: { key: "status_rejected", step: 3, fg: "var(--terracotta)", bg: "var(--terracotta-light)", Icon: XCircle },
  payment_pending: { key: "status_payment_pending", step: 4, fg: "var(--gold-dark)", bg: "var(--gold-light)", Icon: IndianRupee },
  paid: { key: "status_paid", step: 4, fg: "var(--forest)", bg: "var(--forest-light)", Icon: CheckCircle2 },
};

const initialEvents = [
  { id: "E1", crop: "wheat", district: "Karnal", mandi: "Anaj Mandi Sector 12", date: addDays(1), time: "09:00 AM – 01:00 PM", total: 40, filled: 33 },
  { id: "E2", crop: "wheat", district: "Karnal", mandi: "Anaj Mandi Sector 12", date: addDays(2), time: "09:00 AM – 01:00 PM", total: 40, filled: 12 },
  { id: "E3", crop: "rice", district: "Karnal", mandi: "Rice Procurement Centre, Sadar", date: addDays(1), time: "10:00 AM – 02:00 PM", total: 30, filled: 30 },
  { id: "E4", crop: "cotton", district: "Kaithal", mandi: "Cotton Ginning Mandi", date: addDays(3), time: "08:00 AM – 12:00 PM", total: 25, filled: 6 },
  { id: "E5", crop: "maize", district: "Panipat", mandi: "New Grain Market", date: addDays(4), time: "09:00 AM – 12:00 PM", total: 20, filled: 2 },
  { id: "E6", crop: "wheat", district: "Panipat", mandi: "New Grain Market", date: addDays(5), time: "09:00 AM – 01:00 PM", total: 35, filled: 0 },
];

const ME = { name: "Ramesh Kumar", phone: "" };

const initialBatches = [
  { id: "B234", crop: "wheat", qty: 25, district: "Karnal", mandi: "Anaj Mandi Sector 12", date: todayISO(), time: "09:00 AM", token: "T-234", status: "in_queue", queueAhead: 12, mine: true, farmer: "Ramesh Kumar" },
  { id: "B198", crop: "rice", qty: 40, district: "Karnal", mandi: "Rice Procurement Centre, Sadar", date: addDays(-2), time: "10:00 AM", token: "T-198", status: "payment_pending", grade: "Grade A", mine: true, farmer: "Ramesh Kumar" },
  { id: "B211", crop: "wheat", qty: 18, district: "Karnal", mandi: "Anaj Mandi Sector 12", date: addDays(-4), time: "09:00 AM", token: "T-211", status: "rejected", reason: "Moisture content above 14% limit", mine: true, farmer: "Ramesh Kumar" },
  { id: "B250", crop: "cotton", qty: 12, district: "Kaithal", mandi: "Cotton Ginning Mandi", date: addDays(3), time: "08:00 AM", token: "T-250", status: "scheduled", mine: true, farmer: "Ramesh Kumar" },
  { id: "B235", crop: "wheat", qty: 30, district: "Karnal", mandi: "Anaj Mandi Sector 12", date: todayISO(), time: "09:00 AM", token: "T-235", status: "in_queue", queueAhead: 9, mine: false, farmer: "Suresh Yadav" },
  { id: "B236", crop: "wheat", qty: 22, district: "Karnal", mandi: "Anaj Mandi Sector 12", date: todayISO(), time: "09:00 AM", token: "T-236", status: "scheduled", mine: false, farmer: "Geeta Devi" },
  { id: "B237", crop: "wheat", qty: 15, district: "Karnal", mandi: "Anaj Mandi Sector 12", date: todayISO(), time: "09:00 AM", token: "T-237", status: "under_inspection", mine: false, farmer: "Bhupinder Singh" },
];

const initialNotifs = [
  { id: 1, textEn: "Your slot for wheat batch #234 is today, 9:00 AM at Anaj Mandi Sector 12.", textHi: "गेहूं खेप #234 का स्लॉट आज सुबह 9:00 बजे अनाज मंडी सेक्टर 12 में है।", time: "Today, 7:02 AM" },
  { id: 2, textEn: "Batch #198 (rice) accepted — Grade A. Payment will be credited soon.", textHi: "खेप #198 (चावल) स्वीकृत — ग्रेड A। भुगतान जल्द जमा होगा।", time: "2 days ago" },
  { id: 3, textEn: "Batch #211 (wheat) was rejected: moisture above limit.", textHi: "खेप #211 (गेहूं) अस्वीकृत हुई: नमी सीमा से अधिक।", time: "4 days ago" },
];

/* ------------------------------- utilities ------------------------------- */
const Badge = ({ status, lang, size = "sm" }) => {
  const meta = STATUS_META[status];
  const t = useT(lang);
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-head font-semibold ${pad}`}
      style={{ color: meta.fg, background: meta.bg }}
    >
      <meta.Icon size={size === "sm" ? 13 : 15} />
      {t(meta.key)}
    </span>
  );
};

const FakeQR = ({ seed }) => {
  const cells = useMemo(() => {
    let s = 0;
    for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) % 100000;
    const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    return Array.from({ length: 49 }, () => rnd() > 0.52);
  }, [seed]);
  return (
    <div className="grid grid-cols-7 gap-[3px] p-3 bg-white rounded-lg" style={{ width: 148, height: 148 }}>
      {cells.map((on, i) => (
        <div key={i} style={{ background: on ? "var(--ink)" : "transparent" }} />
      ))}
    </div>
  );
};

/* -------------------------------- screens -------------------------------- */

function LoginScreen({ lang, onLogin }) {
  const t = useT(lang);
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("phone");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="flex flex-col justify-center min-h-[560px] px-6">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--forest)" }}>
          <Sprout size={32} color="var(--cream)" />
        </div>
        <h1 className="font-head text-2xl font-bold" style={{ color: "var(--forest)" }}>{t("appName")}</h1>
        <p className="font-body text-sm" style={{ color: "var(--ink-soft)" }}>{t("tagline")}</p>
      </div>

      <div className="rounded-2xl border-2 p-5" style={{ borderColor: "var(--soil-light)", background: "#fff" }}>
        {stage === "phone" ? (
          <>
            <label className="font-head text-sm font-semibold block mb-2" style={{ color: "var(--ink)" }}>{t("phoneLabel")}</label>
            <div className="flex items-center gap-2 rounded-xl px-3 py-3 border-2 mb-4" style={{ borderColor: "var(--soil-light)" }}>
              <Phone size={18} color="var(--ink-soft)" />
              <span className="font-body text-sm" style={{ color: "var(--ink-soft)" }}>+91</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210"
                className="font-body flex-1 outline-none text-base bg-transparent"
                style={{ color: "var(--ink)" }}
                inputMode="numeric"
              />
            </div>
            <button
              disabled={phone.length < 10}
              onClick={() => setStage("otp")}
              className="w-full font-head font-semibold text-base rounded-xl py-3.5 disabled:opacity-40 transition"
              style={{ background: "var(--forest)", color: "var(--cream)" }}
            >
              {t("sendOtp")}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="font-body text-sm" style={{ color: "var(--ink-soft)" }}>
                {t("otpSentTo")} +91 {phone}
              </p>
              <button onClick={() => setStage("phone")} className="font-head text-xs font-semibold" style={{ color: "var(--forest)" }}>
                {t("change")}
              </button>
            </div>
            <label className="font-head text-sm font-semibold block mb-2" style={{ color: "var(--ink)" }}>{t("enterOtp")}</label>
            <div className="flex items-center gap-2 rounded-xl px-3 py-3 border-2 mb-1" style={{ borderColor: "var(--soil-light)" }}>
              <ShieldCheck size={18} color="var(--ink-soft)" />
              <input
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                placeholder="1234"
                className="font-body flex-1 outline-none text-lg tracking-[0.3em] bg-transparent"
                style={{ color: "var(--ink)" }}
                inputMode="numeric"
              />
            </div>
            <p className="font-body text-xs mb-4" style={{ color: "var(--ink-soft)" }}>{t("otpHint")}</p>
            {error && <p className="font-body text-xs mb-3" style={{ color: "var(--terracotta)" }}>{error}</p>}
            <button
              onClick={() => (otp === "1234" ? onLogin(phone) : setError(lang === "hi" ? "गलत OTP, कृपया 1234 डालें" : "Incorrect OTP, please enter 1234"))}
              disabled={otp.length < 4}
              className="w-full font-head font-semibold text-base rounded-xl py-3.5 disabled:opacity-40"
              style={{ background: "var(--forest)", color: "var(--cream)" }}
            >
              {t("verifyLogin")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function CropCard({ b, lang, onClick }) {
  const t = useT(lang);
  const meta = cropMeta(b.crop);
  return (
    <button
      onClick={onClick}
      className="ticket w-full text-left rounded-xl border-2 pr-5 pl-4 py-3.5 mb-3 flex items-center gap-3 active:scale-[0.99] transition"
      style={{ borderColor: "var(--soil-light)", background: "#fff" }}
    >
      <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--forest-light)" }}>
        <meta.Icon size={22} color="var(--forest)" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-head font-semibold text-[15px]" style={{ color: "var(--ink)" }}>
            {lang === "hi" ? meta.hi : meta.en} · #{b.id.slice(1)}
          </span>
        </div>
        <p className="font-body text-xs truncate" style={{ color: "var(--ink-soft)" }}>
          {b.qty} {t("quintal")} · {b.mandi}
        </p>
        <div className="mt-1.5"><Badge status={b.status} lang={lang} /></div>
      </div>
      <ChevronRight size={18} color="var(--ink-soft)" className="shrink-0" />
    </button>
  );
}

function HomeScreen({ lang, batches, notifs, goto }) {
  const t = useT(lang);
  const mine = batches.filter((b) => b.mine);
  const queueBatch = mine.find((b) => b.status === "in_queue");

  return (
    <div className="px-4 pt-5 pb-4">
      <p className="font-body text-sm" style={{ color: "var(--ink-soft)" }}>{t("greeting")},</p>
      <h1 className="font-head text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>{ME.name}</h1>

      {queueBatch && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: "var(--forest)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: "var(--gold)" }} />
            <span className="font-head text-xs font-semibold tracking-wide" style={{ color: "var(--gold-light)" }}>{t("liveQueue")}</span>
          </div>
          <p className="font-head text-2xl font-bold" style={{ color: "#fff" }}>
            {queueBatch.queueAhead} <span className="font-body text-sm font-normal" style={{ color: "var(--forest-light)" }}>{t("farmersAhead")}</span>
          </p>
          <p className="font-body text-sm" style={{ color: "var(--forest-light)" }}>
            ~{queueBatch.queueAhead * 4} {lang === "hi" ? "मिनट" : "min"} {t("estWait")} · {cropMeta(queueBatch.crop)[lang]} #{queueBatch.id.slice(1)}
          </p>
          <button onClick={() => goto("track", queueBatch.id)} className="font-head text-sm font-semibold mt-3 flex items-center gap-1" style={{ color: "var(--gold)" }}>
            {t("viewStatus")} <ChevronRight size={15} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-5">
        <button onClick={() => goto("book")} className="rounded-xl border-2 p-3 text-left" style={{ borderColor: "var(--soil-light)", background: "#fff" }}>
          <Plus size={18} color="var(--forest)" />
          <p className="font-head text-sm font-semibold mt-1.5" style={{ color: "var(--ink)" }}>{t("quickBook")}</p>
        </button>
        <button onClick={() => goto("calendar")} className="rounded-xl border-2 p-3 text-left" style={{ borderColor: "var(--soil-light)", background: "#fff" }}>
          <CalendarIcon size={18} color="var(--forest)" />
          <p className="font-head text-sm font-semibold mt-1.5" style={{ color: "var(--ink)" }}>{t("quickCalendar")}</p>
        </button>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Bell size={16} color="var(--ink-soft)" />
        <h2 className="font-head text-sm font-semibold" style={{ color: "var(--ink)" }}>{t("notifications")}</h2>
      </div>
      <div className="mb-5 rounded-xl border-2 overflow-hidden" style={{ borderColor: "var(--soil-light)" }}>
        {notifs.map((n, i) => (
          <div key={n.id} className="px-3.5 py-3 bg-white" style={{ borderTop: i === 0 ? "none" : "1px solid var(--soil-light)" }}>
            <p className="font-body text-[13px] leading-snug" style={{ color: "var(--ink)" }}>{lang === "hi" ? n.textHi : n.textEn}</p>
            <p className="font-body text-[11px] mt-1" style={{ color: "var(--ink-soft)" }}>{n.time}</p>
          </div>
        ))}
      </div>

      <h2 className="font-head text-sm font-semibold mb-2" style={{ color: "var(--ink)" }}>{t("myCrops")}</h2>
      {mine.length === 0 ? (
        <p className="font-body text-sm" style={{ color: "var(--ink-soft)" }}>{t("noBatches")}</p>
      ) : (
        mine.map((b) => <CropCard key={b.id} b={b} lang={lang} onClick={() => goto("track", b.id)} />)
      )}
    </div>
  );
}

function CalendarScreen({ lang, events, goto, setBookingPrefill }) {
  const t = useT(lang);
  const [crop, setCrop] = useState("all");
  const [district, setDistrict] = useState("all");
  const [mandi, setMandi] = useState("all");

  const filtered = events.filter(
    (e) => (crop === "all" || e.crop === crop) && (district === "all" || e.district === district) && (mandi === "all" || e.mandi === mandi)
  );
  const mandiOptions = district === "all" ? Object.values(MANDIS).flat() : MANDIS[district];

  const Select = ({ value, onChange, options, label }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-body text-xs rounded-lg border-2 px-2.5 py-2 bg-white"
      style={{ borderColor: "var(--soil-light)", color: "var(--ink)" }}
    >
      <option value="all">{label}: {t("all")}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div className="px-4 pt-5 pb-4">
      <h1 className="font-head text-xl font-bold" style={{ color: "var(--ink)" }}>{t("calTitle")}</h1>
      <p className="font-body text-xs mb-4" style={{ color: "var(--ink-soft)" }}>{t("calSub")}</p>

      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none">
        <Select value={crop} onChange={setCrop} options={CROPS.map((c) => c.id)} label={t("filterCrop")} />
        <Select value={district} onChange={(v) => { setDistrict(v); setMandi("all"); }} options={DISTRICTS} label={t("filterDistrict")} />
        <Select value={mandi} onChange={setMandi} options={mandiOptions} label={t("filterMandi")} />
      </div>

      {filtered.length === 0 && <p className="font-body text-sm" style={{ color: "var(--ink-soft)" }}>{t("noEvents")}</p>}

      {filtered.map((e) => {
        const meta = cropMeta(e.crop);
        const open = e.total - e.filled;
        const isFull = open <= 0;
        return (
          <div key={e.id} className="rounded-xl border-2 p-3.5 mb-3 flex gap-3" style={{ borderColor: "var(--soil-light)", background: "#fff" }}>
            <div className="w-14 shrink-0 rounded-lg flex flex-col items-center justify-center py-1.5" style={{ background: "var(--gold-light)" }}>
              <span className="font-head text-lg font-bold leading-none" style={{ color: "var(--gold-dark)" }}>
                {new Date(e.date + "T00:00:00").getDate()}
              </span>
              <span className="font-body text-[10px]" style={{ color: "var(--gold-dark)" }}>
                {new Date(e.date + "T00:00:00").toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { month: "short" })}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <meta.Icon size={14} color="var(--forest)" />
                <span className="font-head text-sm font-semibold" style={{ color: "var(--ink)" }}>{lang === "hi" ? meta.hi : meta.en}</span>
              </div>
              <p className="font-body text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--ink-soft)" }}>
                <MapPin size={11} /> {e.mandi}, {e.district}
              </p>
              <p className="font-body text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>{e.time}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-head text-xs font-semibold" style={{ color: isFull ? "var(--terracotta)" : "var(--forest)" }}>
                  {isFull ? t("full") : `${open} ${t("slotsOpen")}`}
                </span>
                {!isFull && (
                  <button
                    onClick={() => { setBookingPrefill({ crop: e.crop, event: e }); goto("book"); }}
                    className="font-head text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: "var(--forest)", color: "var(--cream)" }}
                  >
                    {t("bookThis")}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BookScreen({ lang, events, prefill, onConfirmBooking, goto }) {
  const t = useT(lang);
  const [phase, setPhase] = useState(prefill?.event ? 3 : 1);
  const [crop, setCrop] = useState(prefill?.crop || null);
  const [qty, setQty] = useState(10);
  const [event, setEvent] = useState(prefill?.event || null);
  const [confirmedToken, setConfirmedToken] = useState(null);

  const availableEvents = events.filter((e) => e.crop === crop && e.total - e.filled > 0);

  if (confirmedToken) {
    return (
      <div className="px-4 pt-8 pb-4 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--forest-light)" }}>
          <Check size={30} color="var(--forest)" />
        </div>
        <h1 className="font-head text-xl font-bold mb-1" style={{ color: "var(--ink)" }}>{t("bookingConfirmed")}</h1>
        <p className="font-body text-xs mb-5" style={{ color: "var(--ink-soft)" }}>{t("showThisAtMandi")}</p>

        <div className="ticket rounded-2xl border-2 pr-6 pl-5 py-5 w-full" style={{ borderColor: "var(--soil-light)", background: "#fff" }}>
          <p className="font-body text-xs mb-1" style={{ color: "var(--ink-soft)" }}>{t("yourToken")}</p>
          <p className="font-head text-3xl font-bold mb-4" style={{ color: "var(--forest)" }}>{confirmedToken}</p>
          <div className="flex justify-center mb-4"><FakeQR seed={confirmedToken} /></div>
          <div className="text-left font-body text-sm space-y-1" style={{ color: "var(--ink)" }}>
            <p><b>{lang === "hi" ? cropMeta(crop).hi : cropMeta(crop).en}</b> · {qty} {t("quintal")}</p>
            <p>{event.mandi}, {event.district}</p>
            <p>{fmtDate(event.date, lang)} · {event.time}</p>
          </div>
        </div>

        <button
          onClick={() => goto("home")}
          className="w-full font-head font-semibold text-base rounded-xl py-3.5 mt-5"
          style={{ background: "var(--forest)", color: "var(--cream)" }}
        >
          {t("goToDashboard")}
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <h1 className="font-head text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>{t("bookTitle")}</h1>

      {phase === 1 && (
        <>
          <p className="font-head text-sm font-semibold mb-2" style={{ color: "var(--ink)" }}>{t("step1")}</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {CROPS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCrop(c.id)}
                className="rounded-xl border-2 py-4 flex flex-col items-center gap-1.5"
                style={{ borderColor: crop === c.id ? "var(--forest)" : "var(--soil-light)", background: crop === c.id ? "var(--forest-light)" : "#fff" }}
              >
                <c.Icon size={26} color="var(--forest)" />
                <span className="font-head text-sm font-semibold" style={{ color: "var(--ink)" }}>{lang === "hi" ? c.hi : c.en}</span>
              </button>
            ))}
          </div>
          <button
            disabled={!crop}
            onClick={() => setPhase(2)}
            className="w-full font-head font-semibold rounded-xl py-3.5 disabled:opacity-40"
            style={{ background: "var(--forest)", color: "var(--cream)" }}
          >
            {t("next")}
          </button>
        </>
      )}

      {phase === 2 && (
        <>
          <p className="font-head text-sm font-semibold mb-2" style={{ color: "var(--ink)" }}>{t("step2")}</p>
          <div className="rounded-xl border-2 p-5 flex items-center justify-center gap-6 mb-5" style={{ borderColor: "var(--soil-light)", background: "#fff" }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 5))} className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "var(--forest-light)" }}>
              <Minus size={18} color="var(--forest)" />
            </button>
            <div className="text-center">
              <p className="font-head text-3xl font-bold" style={{ color: "var(--ink)" }}>{qty}</p>
              <p className="font-body text-xs" style={{ color: "var(--ink-soft)" }}>{t("quintal")}</p>
            </div>
            <button onClick={() => setQty((q) => q + 5)} className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "var(--forest-light)" }}>
              <Plus size={18} color="var(--forest)" />
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPhase(1)} className="flex-1 font-head font-semibold rounded-xl py-3.5 border-2" style={{ borderColor: "var(--soil-light)", color: "var(--ink)" }}>{t("back")}</button>
            <button onClick={() => setPhase(3)} className="flex-1 font-head font-semibold rounded-xl py-3.5" style={{ background: "var(--forest)", color: "var(--cream)" }}>{t("next")}</button>
          </div>
        </>
      )}

      {phase === 3 && (
        <>
          <p className="font-head text-sm font-semibold mb-2" style={{ color: "var(--ink)" }}>{t("step3")}</p>
          {availableEvents.length === 0 && <p className="font-body text-sm mb-3" style={{ color: "var(--ink-soft)" }}>{t("noEvents")}</p>}
          <div className="mb-5 space-y-2.5">
            {availableEvents.map((e) => (
              <button
                key={e.id}
                onClick={() => setEvent(e)}
                className="w-full text-left rounded-xl border-2 px-3.5 py-3 flex items-center justify-between"
                style={{ borderColor: event?.id === e.id ? "var(--forest)" : "var(--soil-light)", background: event?.id === e.id ? "var(--forest-light)" : "#fff" }}
              >
                <div>
                  <p className="font-head text-sm font-semibold" style={{ color: "var(--ink)" }}>{fmtDate(e.date, lang)} · {e.time}</p>
                  <p className="font-body text-xs" style={{ color: "var(--ink-soft)" }}>{e.mandi}, {e.district}</p>
                </div>
                {event?.id === e.id && <CheckCircle2 size={20} color="var(--forest)" />}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPhase(2)} className="flex-1 font-head font-semibold rounded-xl py-3.5 border-2" style={{ borderColor: "var(--soil-light)", color: "var(--ink)" }}>{t("back")}</button>
            <button
              disabled={!event}
              onClick={() => { const tok = "T-" + Math.floor(300 + Math.random() * 90); setConfirmedToken(tok); onConfirmBooking({ crop, qty, event, token: tok }); }}
              className="flex-1 font-head font-semibold rounded-xl py-3.5 disabled:opacity-40"
              style={{ background: "var(--forest)", color: "var(--cream)" }}
            >
              {t("confirmBooking")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const STEP_LABELS = ["submitted", "queued", "inspected", "decision", "payment"];

function StepTracker({ lang, batch }) {
  const t = useT(lang);
  const meta = STATUS_META[batch.status];
  const isRejected = batch.status === "rejected";
  const currentStep = meta.step;

  return (
    <div className="rounded-xl border-2 p-4" style={{ borderColor: "var(--soil-light)", background: "#fff" }}>
      {STEP_LABELS.map((label, i) => {
        if (i === 4 && isRejected) return null;
        const done = i < currentStep || (i === currentStep && !["scheduled"].includes(batch.status));
        const active = i === currentStep;
        const isRejStep = i === 3 && isRejected;
        const color = isRejStep ? "var(--terracotta)" : done ? "var(--forest)" : "var(--soil-light)";
        const bg = isRejStep ? "var(--terracotta-light)" : done ? "var(--forest-light)" : "var(--cream)";
        return (
          <div key={label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: bg, border: `2px solid ${color}` }}>
                {isRejStep ? <XCircle size={15} color={color} /> : done ? <Check size={15} color={color} /> : <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />}
              </div>
              {i < STEP_LABELS.length - 1 && !(i === 3 && isRejected) && (
                <div className="w-0.5 flex-1 min-h-[22px]" style={{ background: i < currentStep ? "var(--forest)" : "var(--soil-light)" }} />
              )}
            </div>
            <div className="pb-5">
              <p className="font-head text-sm font-semibold" style={{ color: active ? color : "var(--ink)" }}>
                {isRejStep ? t("status_rejected") : t(label)}
              </p>
              {active && batch.status === "in_queue" && (
                <p className="font-body text-xs" style={{ color: "var(--ink-soft)" }}>{batch.queueAhead} {t("farmersAhead")}</p>
              )}
              {isRejStep && batch.reason && (
                <p className="font-body text-xs mt-0.5" style={{ color: "var(--terracotta)" }}>{t("rejectionReason")}: {batch.reason}</p>
              )}
              {i === 3 && batch.status === "accepted" && batch.grade && (
                <p className="font-body text-xs mt-0.5" style={{ color: "var(--forest)" }}>{t("gradeNote")}: {batch.grade}</p>
              )}
              {i === 4 && batch.status === "paid" && (
                <p className="font-body text-xs mt-0.5" style={{ color: "var(--forest)" }}>{t("status_paid")} ✓</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrackScreen({ lang, batches, selectedId, setSelectedId }) {
  const t = useT(lang);
  const mine = batches.filter((b) => b.mine);
  const batch = mine.find((b) => b.id === selectedId) || mine[0];

  return (
    <div className="px-4 pt-5 pb-4">
      <h1 className="font-head text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>{t("trackTitle")}</h1>

      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none">
        {mine.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedId(b.id)}
            className="shrink-0 rounded-full px-3.5 py-2 font-head text-xs font-semibold border-2"
            style={{
              borderColor: batch?.id === b.id ? "var(--forest)" : "var(--soil-light)",
              background: batch?.id === b.id ? "var(--forest)" : "#fff",
              color: batch?.id === b.id ? "var(--cream)" : "var(--ink)",
            }}
          >
            #{b.id.slice(1)}
          </button>
        ))}
      </div>

      {batch && (
        <>
          <div className="rounded-xl border-2 p-4 mb-4 flex items-center gap-3" style={{ borderColor: "var(--soil-light)", background: "#fff" }}>
            <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ background: "var(--forest-light)" }}>
              {React.createElement(cropMeta(batch.crop).Icon, { size: 22, color: "var(--forest)" })}
            </div>
            <div className="flex-1">
              <p className="font-head text-sm font-semibold" style={{ color: "var(--ink)" }}>
                {lang === "hi" ? cropMeta(batch.crop).hi : cropMeta(batch.crop).en} · {batch.qty} {t("quintal")}
              </p>
              <p className="font-body text-xs" style={{ color: "var(--ink-soft)" }}>{t("token")}: {batch.token} · {batch.mandi}</p>
            </div>
            <Badge status={batch.status} lang={lang} />
          </div>
          <StepTracker lang={lang} batch={batch} />
        </>
      )}
    </div>
  );
}

function AdminScreen({ lang, batches, setBatches, exitAdmin }) {
  const t = useT(lang);
  const [rejecting, setRejecting] = useState(null);
  const [reasonDraft, setReasonDraft] = useState("");
  const today = batches.filter((b) => b.date === todayISO());

  const advance = (id, updates) => setBatches((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-head text-xl font-bold" style={{ color: "var(--ink)" }}>{t("adminTitle")}</h1>
        <button onClick={exitAdmin} className="font-head text-xs font-semibold flex items-center gap-1" style={{ color: "var(--forest)" }}>
          <ArrowLeft size={14} /> {t("backToFarmer")}
        </button>
      </div>
      <p className="font-body text-xs mb-4" style={{ color: "var(--ink-soft)" }}>{t("todaysQueue")} · Anaj Mandi Sector 12</p>

      {today.map((b) => {
        const meta = cropMeta(b.crop);
        return (
          <div key={b.id} className="rounded-xl border-2 p-3.5 mb-3" style={{ borderColor: "var(--soil-light)", background: "#fff" }}>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--forest-light)" }}>
                <meta.Icon size={18} color="var(--forest)" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-head text-sm font-semibold truncate" style={{ color: "var(--ink)" }}>{b.farmer} · {b.token}</p>
                <p className="font-body text-xs" style={{ color: "var(--ink-soft)" }}>{lang === "hi" ? meta.hi : meta.en} · {b.qty} {t("quintal")}</p>
              </div>
              <Badge status={b.status} lang={lang} />
            </div>

            {rejecting === b.id ? (
              <div>
                <input
                  value={reasonDraft}
                  onChange={(e) => setReasonDraft(e.target.value)}
                  placeholder={t("reasonPlaceholder")}
                  className="w-full font-body text-sm rounded-lg border-2 px-3 py-2 mb-2 outline-none"
                  style={{ borderColor: "var(--terracotta)", color: "var(--ink)" }}
                />
                <div className="flex gap-2">
                  <button onClick={() => { setRejecting(null); setReasonDraft(""); }} className="flex-1 font-head text-xs font-semibold rounded-lg py-2 border-2" style={{ borderColor: "var(--soil-light)", color: "var(--ink)" }}>{t("cancel")}</button>
                  <button
                    onClick={() => { advance(b.id, { status: "rejected", reason: reasonDraft || t("reasonPlaceholder") }); setRejecting(null); setReasonDraft(""); }}
                    className="flex-1 font-head text-xs font-semibold rounded-lg py-2"
                    style={{ background: "var(--terracotta)", color: "#fff" }}
                  >
                    {t("confirm")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {b.status === "scheduled" && (
                  <button onClick={() => advance(b.id, { status: "in_queue", queueAhead: today.filter((x) => x.status === "in_queue").length })} className="font-head text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: "var(--gold-light)", color: "var(--gold-dark)" }}>{t("checkIn")}</button>
                )}
                {b.status === "in_queue" && (
                  <button onClick={() => advance(b.id, { status: "under_inspection" })} className="font-head text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: "var(--amber-light)", color: "var(--amber)" }}>{t("startInspection")}</button>
                )}
                {b.status === "under_inspection" && (
                  <>
                    <button onClick={() => advance(b.id, { status: "accepted", grade: "Grade A" })} className="font-head text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: "var(--forest-light)", color: "var(--forest)" }}>{t("accept")}</button>
                    <button onClick={() => setRejecting(b.id)} className="font-head text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: "var(--terracotta-light)", color: "var(--terracotta)" }}>{t("reject")}</button>
                  </>
                )}
                {b.status === "accepted" && (
                  <button onClick={() => advance(b.id, { status: "payment_pending" })} className="font-head text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: "var(--gold-light)", color: "var(--gold-dark)" }}>{t("sendToPayment")}</button>
                )}
                {b.status === "payment_pending" && (
                  <button onClick={() => advance(b.id, { status: "paid" })} className="font-head text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: "var(--forest-light)", color: "var(--forest)" }}>{t("markPaid")}</button>
                )}
                {(b.status === "rejected" || b.status === "paid") && (
                  <span className="font-body text-xs" style={{ color: "var(--ink-soft)" }}>—</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------- shell ---------------------------------- */
function NavButton({ active, onClick, Icon, label }) {
  return (
    <button onClick={onClick} className="flex-1 flex flex-col items-center gap-1 py-2.5">
      <Icon size={21} color={active ? "var(--forest)" : "var(--ink-soft)"} strokeWidth={active ? 2.4 : 2} />
      <span className="font-head text-[11px] font-semibold" style={{ color: active ? "var(--forest)" : "var(--ink-soft)" }}>{label}</span>
    </button>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  const t = useT(lang);
  const [authed, setAuthed] = useState(false);
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("farmer");
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [bookingPrefill, setBookingPrefill] = useState(null);
  const [batches, setBatches] = useState(initialBatches);
  const [notifs] = useState(initialNotifs);

  // simulate a live, ticking queue + one automatic status transition
  useEffect(() => {
    const iv = setInterval(() => {
      setBatches((prev) =>
        prev.map((b) => {
          if (b.status === "in_queue" && b.queueAhead > 0) {
            const next = b.queueAhead - 1;
            if (next === 0) return { ...b, queueAhead: 0, status: "under_inspection" };
            return { ...b, queueAhead: next };
          }
          return b;
        })
      );
    }, 6000);
    return () => clearInterval(iv);
  }, []);

  const goto = (s, batchId) => {
    if (batchId) setSelectedBatchId(batchId);
    setScreen(s);
  };

  const handleConfirmBooking = ({ crop, qty, event, token }) => {
    setBatches((prev) => [
      { id: "B" + token.slice(2), crop, qty, district: event.district, mandi: event.mandi, date: event.date, time: event.time, token, status: "scheduled", mine: true, farmer: ME.name },
      ...prev,
    ]);
    setBookingPrefill(null);
  };

  const HeaderBar = () => (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--forest)" }}>
          <Sprout size={17} color="var(--cream)" />
        </div>
        <span className="font-head text-base font-bold" style={{ color: "var(--forest)" }}>{t("appName")}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLang((l) => (l === "en" ? "hi" : "en"))}
          className="flex items-center gap-1 rounded-full border-2 px-2.5 py-1"
          style={{ borderColor: "var(--soil-light)" }}
        >
          <Languages size={13} color="var(--ink-soft)" />
          <span className="font-head text-xs font-semibold" style={{ color: "var(--ink)" }}>{lang === "en" ? "हिं" : "EN"}</span>
        </button>
        {authed && mode === "farmer" && (
          <button onClick={() => { setMode("admin"); setScreen("admin"); }} className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "var(--soil-light)" }}>
            <Store size={15} color="var(--ink-soft)" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: "#EDE6D6" }}>
      <Tokens />
      <div className="w-full max-w-[440px] min-h-screen relative font-body flex flex-col" style={{ background: "var(--cream)" }}>
        <HeaderBar />

        <div className="flex-1 overflow-y-auto scrollbar-none pb-4">
          {!authed ? (
            <LoginScreen lang={lang} onLogin={(phone) => { ME.phone = phone; setAuthed(true); }} />
          ) : mode === "admin" ? (
            <AdminScreen lang={lang} batches={batches} setBatches={setBatches} exitAdmin={() => { setMode("farmer"); setScreen("home"); }} />
          ) : screen === "home" ? (
            <HomeScreen lang={lang} batches={batches} notifs={notifs} goto={goto} />
          ) : screen === "calendar" ? (
            <CalendarScreen lang={lang} events={initialEvents} goto={goto} setBookingPrefill={setBookingPrefill} />
          ) : screen === "book" ? (
            <BookScreen lang={lang} events={initialEvents} prefill={bookingPrefill} onConfirmBooking={handleConfirmBooking} goto={goto} />
          ) : screen === "track" ? (
            <TrackScreen lang={lang} batches={batches} selectedId={selectedBatchId} setSelectedId={setSelectedBatchId} />
          ) : null}
        </div>

        {authed && mode === "farmer" && (
          <div className="flex border-t-2 sticky bottom-0" style={{ borderColor: "var(--soil-light)", background: "var(--cream)" }}>
            <NavButton active={screen === "home"} onClick={() => goto("home")} Icon={HomeIcon} label={t("home")} />
            <NavButton active={screen === "calendar"} onClick={() => goto("calendar")} Icon={CalendarIcon} label={t("calendarNav")} />
            <NavButton active={screen === "book"} onClick={() => { setBookingPrefill(null); goto("book"); }} Icon={Plus} label={t("book")} />
            <NavButton active={screen === "track"} onClick={() => goto("track")} Icon={ClipboardList} label={t("trackTitle").split(" ")[0]} />
          </div>
        )}
      </div>
    </div>
  );
}
