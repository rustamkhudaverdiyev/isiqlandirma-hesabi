// Lighting calculator (Lumen method) with presets + explanations + shareable URL

const $ = (id) => document.getElementById(id);

const presetEl = $("preset");
const areaEl = $("area");
const luxEl = $("lux");
const ufEl = $("uf");
const mfEl = $("mf");
const lumEl = $("luminaire");

const statusEl = $("status");
const fixtureCountEl = $("fixtureCount");
const layoutHintEl = $("layoutHint");
const detailsEl = $("details");
const whyBoxEl = $("whyBox");

const calcBtn = $("calcBtn");
const copyBtn = $("copyBtn");

const PRESETS = [
  // --- Manual ---
  { id:"manual", group:"Manual", name:"Manual (özün seç)", lux:null, uf:null, mf:null,
    note:"Dəyərləri özün daxil edirsən. Lux/UF/MF üzrə standart yoxlamanı özün et." },

  // --- Yaşayış ---
  { id:"dehliz", group:"Yaşayış", name:"Dəhliz / Koridor", lux:100, uf:0.50, mf:0.75,
    note:"Yol tapma və ümumi işıq. Adətən 75–150 lux." },
  { id:"qonaq", group:"Yaşayış", name:"Qonaq otağı", lux:200, uf:0.50, mf:0.75,
    note:"Rahat mühit. Lokal oxu zonası ayrıca artırıla bilər." },
  { id:"yataq", group:"Yaşayış", name:"Yataq otağı", lux:150, uf:0.50, mf:0.75,
    note:"Ümumi işıq 100–200 lux. Oxu lampası ayrıca." },
  { id:"metbex", group:"Yaşayış", name:"Mətbəx (ümumi)", lux:300, uf:0.55, mf:0.75,
    note:"Ümumi işıq 200–300 lux. İş səthi üçün 500 lux lokal tövsiyə." },
  { id:"metbex_is", group:"Yaşayış", name:"Mətbəx (iş səthi)", lux:500, uf:0.55, mf:0.75,
    note:"Doğrama/bişirmə zonası. Lokal işıqlandırma kimi düşün." },
  { id:"hamam", group:"Yaşayış", name:"Hamam (ümumi)", lux:200, uf:0.50, mf:0.75,
    note:"Nəmlik + buxar. IP seçimi ayrıca yoxlanmalıdır." },
  { id:"wc", group:"Yaşayış", name:"WC", lux:150, uf:0.50, mf:0.75,
    note:"Kiçik sahələrdə 100–200 lux kifayət edir." },
  { id:"paltar", group:"Yaşayış", name:"Geyim otağı / Garderob", lux:300, uf:0.55, mf:0.75,
    note:"Rəng seçimi üçün işıq bir az yüksək ola bilər." },
  { id:"balkon", group:"Yaşayış", name:"Balkon / Veranda", lux:100, uf:0.45, mf:0.70,
    note:"Xarici mühit. Tozlanma daha çox ola bilər." },

  // --- Ofis / Təhsil ---
  { id:"ofis", group:"Ofis / Təhsil", name:"Ofis (kompüter işi)", lux:500, uf:0.60, mf:0.80,
    note:"Tipik norma 500 lux. Ekran parıltısı (UGR) ayrıca vacibdir." },
  { id:"sinif", group:"Ofis / Təhsil", name:"Sinif otağı", lux:300, uf:0.60, mf:0.80,
    note:"Taxta və yazı üçün kifayət. Taxta üçün lokal əlavə ola bilər." },
  { id:"konfrans", group:"Ofis / Təhsil", name:"Konfrans zalı", lux:300, uf:0.60, mf:0.80,
    note:"Təqdimat üçün dimming/scene ayrıca düşünülür." },
  { id:"koridor_ofis", group:"Ofis / Təhsil", name:"Ofis koridoru", lux:150, uf:0.55, mf:0.80,
    note:"Yol tapma və təhlükəsizlik." },
  { id:"qebul", group:"Ofis / Təhsil", name:"Resepsiyon / Qəbul", lux:300, uf:0.60, mf:0.80,
    note:"Vizual rahatlıq üçün 300–500 lux ola bilər." },

  // --- Ticarət / İctimai ---
  { id:"magaza", group:"Ticarət / İctimai", name:"Mağaza (ümumi)", lux:750, uf:0.60, mf:0.80,
    note:"Satış zonası. Vitrinlər daha yüksək ola bilər." },
  { id:"vitrin", group:"Ticarət / İctimai", name:"Vitrin / Display", lux:1000, uf:0.60, mf:0.80,
    note:"Məhsul vurğusu. Parıltı və rəng göstəricisi (CRI) önəmlidir." },
  { id:"kafe", group:"Ticarət / İctimai", name:"Kafe / Restoran (ümumi)", lux:200, uf:0.55, mf:0.75,
    note:"Atmosfer üçün bəzən aşağı saxlanır, dekorativ işıq əlavə olunur." },
  { id:"muhafize", group:"Ticarət / İctimai", name:"Mühafizə postu", lux:300, uf:0.60, mf:0.80,
    note:"Monitor + sənəd işi. 300–500 lux." },
  { id:"xestexana_palata", group:"Ticarət / İctimai", name:"Xəstəxana palatası", lux:300, uf:0.60, mf:0.80,
    note:"Tibbi tələblər əlavə ola bilər." },

  // --- Sənaye / Fabrik ---
  { id:"fabrik_yigim", group:"Sənaye / Fabrik", name:"Fabrik (yığım xətti)", lux:750, uf:0.50, mf:0.70,
    note:"Dəqiqlik tələb edən iş. Toz/yağ varsa MF aşağı düşə bilər." },
  { id:"fabrik_istehsal", group:"Sənaye / Fabrik", name:"Fabrik (ümumi istehsal)", lux:500, uf:0.50, mf:0.70,
    note:"Orta dəqiqlik. MF adətən 0.65–0.75." },
  { id:"fabrik_deqiq", group:"Sənaye / Fabrik", name:"Fabrik (dəqiq iş / montaj)", lux:1000, uf:0.50, mf:0.70,
    note:"Yüksək dəqiqlik. UGR və flicker də önəmlidir." },
  { id:"sex_qaynaq", group:"Sənaye / Fabrik", name:"Qaynaq sahəsi", lux:300, uf:0.45, mf:0.65,
    note:"Qoruyucu maska/optika və təhlükəsizlik tələbləri ayrıca." },
  { id:"emalatxana", group:"Sənaye / Fabrik", name:"Emalatxana", lux:500, uf:0.50, mf:0.70,
    note:"Təmir və servis işləri." },

  // --- Anbar / Logistika ---
  { id:"anbar", group:"Anbar / Logistika", name:"Anbar (ümumi)", lux:200, uf:0.40, mf:0.70,
    note:"Tünd səthlər UF-ni azaldır. Raflar varsa paylanma dəyişir." },
  { id:"anbar_raf", group:"Anbar / Logistika", name:"Anbar (raf arası koridor)", lux:150, uf:0.40, mf:0.70,
    note:"Raf kölgələri ola bilər. Optika seçimi vacibdir." },
  { id:"yukleme", group:"Anbar / Logistika", name:"Yükləmə rampası", lux:200, uf:0.40, mf:0.70,
    note:"Təhlükəsizlik üçün kifayət işıq." },

  // --- Texniki sahələr ---
  { id:"qaraj", group:"Texniki", name:"Qaraj", lux:100, uf:0.40, mf:0.70,
    note:"Ümumi işıq. Detal iş üçün lokal əlavə." },
  { id:"server", group:"Texniki", name:"Server otağı", lux:300, uf:0.55, mf:0.80,
    note:"Texniki servis işi. Flicker + ehtiyat enerji ayrıca." },
  { id:"qazanxana", group:"Texniki", name:"Qazanxana / Texniki otaq", lux:200, uf:0.45, mf:0.70,
    note:"Servis üçün orta işıq." },
  { id:"pilləkan", group:"Texniki", name:"Pilləkan", lux:150, uf:0.50, mf:0.75,
    note:"Təhlükəsizlik üçün." },
];

function clamp(n, lo, hi) {
  if (!Number.isFinite(n)) return NaN;
  return Math.min(hi, Math.max(lo, n));
}

function fmt(n, d=0) {
  return Number.isFinite(n) ? n.toFixed(d) : "—";
}

function buildPresetSelect() {
  const groups = new Map();
  for (const p of PRESETS) {
    if (!groups.has(p.group)) groups.set(p.group, []);
    groups.get(p.group).push(p);
  }

  presetEl.innerHTML = "";
  for (const [group, items] of groups.entries()) {
    const og = document.createElement("optgroup");
    og.label = group;
    for (const it of items) {
      const opt = document.createElement("option");
      opt.value = it.id;
      opt.textContent = it.name;
      og.appendChild(opt);
    }
    presetEl.appendChild(og);
  }
}

function getPresetById(id) {
  return PRESETS.find(p => p.id === id) || PRESETS[0];
}

function setInputsFromPreset(p) {
  if (p.lux != null) luxEl.value = p.lux;
  if (p.uf != null) ufEl.value = p.uf;
  if (p.mf != null) mfEl.value = p.mf;

  // status hint about preset
  if (p.id !== "manual") {
    statusEl.className = "status warn";
    statusEl.innerHTML = `Preset seçildi: <b>${p.name}</b>. ${p.note || ""}`;
  } else {
    statusEl.className = "status warn";
    statusEl.innerHTML = `Manual rejim. Lux/UF/MF dəyərlərini özün seçirsən.`;
  }
}

function getInputs() {
  const S = Number(areaEl.value);
  const E = Number(luxEl.value);
  const UF = Number(ufEl.value);
  const MF = Number(mfEl.value);
  const lm = Number(lumEl.value);

  return {
    preset: presetEl.value,
    S,
    E,
    UF,
    MF,
    lm
  };
}

function updateUrl(inp) {
  const u = new URL(location.href);
  u.searchParams.set("preset", inp.preset);
  u.searchParams.set("S", String(inp.S));
  u.searchParams.set("E", String(inp.E));
  u.searchParams.set("UF", String(inp.UF));
  u.searchParams.set("MF", String(inp.MF));
  u.searchParams.set("lm", String(inp.lm));
  history.replaceState({}, "", u.toString());
}

function setFromUrl() {
  const u = new URL(location.href);
  const g = (k) => u.searchParams.get(k);

  const preset = g("preset");
  if (preset && PRESETS.some(p=>p.id===preset)) presetEl.value = preset;

  const S = g("S"); if (S) areaEl.value = S;
  const E = g("E"); if (E) luxEl.value = E;
  const UF = g("UF"); if (UF) ufEl.value = UF;
  const MF = g("MF"); if (MF) mfEl.value = MF;
  const lm = g("lm"); if (lm) lumEl.value = lm;
}

function suggestLayout(n) {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n === 1) return "1×1";
  if (n === 2) return "1×2";
  if (n === 3) return "1×3";
  if (n === 4) return "2×2";

  // try near-square layout
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  return `${rows}×${cols} (təxmini)`;
}

function calc(inp) {
  const S = inp.S;
  const E = inp.E;
  const UF = inp.UF;
  const MF = inp.MF;
  const lm = inp.lm;

  if (!(S > 0 && E > 0 && UF > 0 && MF > 0 && lm > 0)) {
    return { ok:false, err:"Bütün dəyərlər 0-dan böyük olmalıdır." };
  }

  const UFc = clamp(UF, 0.1, 0.95);
  const MFc = clamp(MF, 0.1, 0.95);

  // Base lux requirement without factors
  const baseLumens = E * S;

  // Lumen method
  const totalLumens = baseLumens / (UFc * MFc);
  const count = Math.ceil(totalLumens / lm);

  return {
    ok:true,
    S, E, UF:UFc, MF:MFc, lm,
    baseLumens,
    totalLumens,
    count
  };
}

function render(inp, res) {
  if (!res.ok) {
    statusEl.className = "status err";
    statusEl.textContent = res.err;
    fixtureCountEl.textContent = "—";
    layoutHintEl.textContent = "—";
    detailsEl.innerHTML = "";
    whyBoxEl.innerHTML = "";
    window.__copy = null;
    return;
  }

  const presetObj = getPresetById(inp.preset);
  const layout = suggestLayout(res.count);

  statusEl.className = "status ok";
  statusEl.innerHTML = `Hesablandı. Preset: <b>${presetObj.name}</b>`;

  fixtureCountEl.textContent = String(res.count);
  layoutHintEl.textContent = `Yerləşmə təklifi: ${layout}`;

  detailsEl.innerHTML = `
    <b>Ümumi lümen ehtiyacı:</b> ${fmt(res.totalLumens, 0)} lm<br>
    <b>İlkin (UF/MF-siz) ehtiyac:</b> ${fmt(res.baseLumens, 0)} lm<br>
    <b>1 armatur:</b> ${fmt(res.lm, 0)} lm<br>
    <b>Girişlər:</b> S=${fmt(res.S,0)} m², E=${fmt(res.E,0)} lux, UF=${fmt(res.UF,2)}, MF=${fmt(res.MF,2)}
  `;

  whyBoxEl.innerHTML = `
    <div><b>1)</b> İlkin ehtiyac: <b>E × S</b> = ${fmt(res.E,0)} × ${fmt(res.S,0)} = <b>${fmt(res.baseLumens,0)} lm</b></div>
    <div><b>2)</b> UF və MF itkiləri: <b>${fmt(res.UF,2)} × ${fmt(res.MF,2)} = ${fmt(res.UF*res.MF,2)}</b></div>
    <div><b>3)</b> Real ehtiyac: <b>(E×S)/(UF×MF)</b> = ${fmt(res.baseLumens,0)} / ${fmt(res.UF*res.MF,2)} = <b>${fmt(res.totalLumens,0)} lm</b></div>
    <div><b>4)</b> Armatur sayı: <b>ceil(Φ_total / Φ_armatur)</b> = ceil(${fmt(res.totalLumens,0)} / ${fmt(res.lm,0)}) = <b>${res.count}</b></div>
    <div style="margin-top:8px;color:#64748b">
      UF — çıxan işığın iş səthinə çatma payı, MF — zamanla zəifləmə/çirklənmə payıdır.
    </div>
  `;

  window.__copy = `İşıqlandırma Hesabı (Lümen metodu)
Preset: ${presetObj.name}
Sahə: ${fmt(res.S,0)} m²
Lux: ${fmt(res.E,0)}
UF: ${fmt(res.UF,2)}
MF: ${fmt(res.MF,2)}
1 armatur: ${fmt(res.lm,0)} lm
İlkin ehtiyac (E×S): ${fmt(res.baseLumens,0)} lm
Ümumi lümen: ${fmt(res.totalLumens,0)} lm
Armatur sayı: ${res.count}
Yerləşmə: ${layout}`;
}

function run() {
  const inp = getInputs();
  updateUrl(inp);
  const res = calc(inp);
  render(inp, res);
}

// Events
presetEl.addEventListener("change", () => {
  const p = getPresetById(presetEl.value);
  setInputsFromPreset(p);
  run();
});

calcBtn.addEventListener("click", run);

copyBtn.addEventListener("click", async () => {
  if (!window.__copy) return alert("Əvvəlcə hesabla.");
  try {
    await navigator.clipboard.writeText(window.__copy);
    alert("Kopyalandı.");
  } catch {
    alert("Brauzer icazə vermədi. Nəticəni əl ilə seçib kopyala.");
  }
});

// Init
buildPresetSelect();

// default preset
presetEl.value = "sinif";

// load from URL overrides
setFromUrl();

// apply preset note but DO NOT overwrite url-provided manual values unless preset chosen explicitly
setInputsFromPreset(getPresetById(presetEl.value));

// initial calc
run();
