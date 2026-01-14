// İŞIQLANDIRMA HESABI (V1)
// Lümen metodu ilə ilkin armatur sayı: preset + izah + paylaş link + kopyalama

// Eyni fayl 2 dəfə yüklənirsə "PRESETS already declared" olmasın deyə guard
if (window.__LIGHT_APP_LOADED__) {
  console.warn("App.js artıq yüklənib (2-ci dəfə). Script dayandırıldı.");
} else {
  window.__LIGHT_APP_LOADED__ = true;

  // Presetlər (istəsən artıra bilərsən)
  const PRESETS = [
    // Ev / mənzil
    { key: "dehliz",  name: "Dəhliz / Holl",          lux: 100, uf: 0.55, mf: 0.80 },
    { key: "kuxna",   name: "Mətbəx",                 lux: 300, uf: 0.60, mf: 0.80 },
    { key: "yataq",   name: "Yataq otağı",            lux: 150, uf: 0.60, mf: 0.80 },
    { key: "qonaq",   name: "Qonaq / Oturma otağı",   lux: 200, uf: 0.60, mf: 0.80 },
    { key: "wc",      name: "WC / Hamam",             lux: 200, uf: 0.55, mf: 0.75 },
    { key: "ofis_ev", name: "Ev ofisi / İş masası",   lux: 500, uf: 0.65, mf: 0.80 },

    // Ticarət / ofis
    { key: "ofis",    name: "Ofis (ümumi)",           lux: 500, uf: 0.65, mf: 0.80 },
    { key: "sinif",   name: "Sinif otağı",            lux: 300, uf: 0.60, mf: 0.80 },
    { key: "koridor", name: "İctimai koridor",        lux: 150, uf: 0.55, mf: 0.80 },

    // Sənaye / anbar
    { key: "anbar",   name: "Anbar",                  lux: 200, uf: 0.55, mf: 0.75 },
    { key: "sex",     name: "Sex / İstehsalat",       lux: 300, uf: 0.55, mf: 0.70 },
    { key: "fabrik",  name: "Fabrik (ümumi)",         lux: 300, uf: 0.55, mf: 0.70 },
    { key: "montaj",  name: "Montaj dəzgahı (dəqiq)", lux: 750, uf: 0.70, mf: 0.80 },
  ];

  // DOM
  const presetEl = document.getElementById("preset");
  const areaEl = document.getElementById("area");
  const luxEl = document.getElementById("lux");
  const ufEl = document.getElementById("uf");
  const mfEl = document.getElementById("mf");
  const luminaireEl = document.getElementById("luminaire");

  const calcBtn = document.getElementById("calcBtn");
  const copyBtn = document.getElementById("copyBtn");
  const infoBtn = document.getElementById("infoBtn");

  const fixtureCountEl = document.getElementById("fixtureCount");
  const layoutHintEl = document.getElementById("layoutHint");
  const statusEl = document.getElementById("status");
  const detailsEl = document.getElementById("details");
  const whyBoxEl = document.getElementById("whyBox");
  const heroMiniEl = document.getElementById("heroMini");

  // Sərt yoxlama: elementlərdən biri yoxdursa, boşuna davam eləmə
  const must = {
    presetEl, areaEl, luxEl, ufEl, mfEl, luminaireEl,
    calcBtn, copyBtn,
    fixtureCountEl, layoutHintEl, statusEl, detailsEl, whyBoxEl, heroMiniEl
  };
  for (const [k, v] of Object.entries(must)) {
    if (!v) {
      console.error("DOM tapılmadı:", k);
      // script-i dayandır
      throw new Error("DOM element missing: " + k);
    }
  }

  // Helpers
  function fmt(n, d = 2) {
    return Number.isFinite(n) ? Number(n).toFixed(d) : "—";
  }
  function ceilInt(n) {
    return Math.ceil(Number(n));
  }

  // Layout təxmini (gözə xoş "2×3" kimi)
  function suggestGrid(n) {
    if (!Number.isFinite(n) || n <= 0) return "—";
    let best = { r: 1, c: n, score: Infinity };
    for (let r = 1; r <= Math.ceil(Math.sqrt(n)); r++) {
      const c = Math.ceil(n / r);
      const score = Math.abs(c - r) + (c * r - n) * 0.25;
      if (score < best.score) best = { r, c, score };
    }
    return `${best.r}×${best.c}`;
  }

  // URL param
  function getInputs() {
    return {
      preset: presetEl.value || "",
      area: Number(areaEl.value),
      lux: Number(luxEl.value),
      uf: Number(ufEl.value),
      mf: Number(mfEl.value),
      lm: Number(luminaireEl.value),
    };
  }

  function setInputsFromParams() {
    const u = new URL(location.href);
    const g = (k) => u.searchParams.get(k);

    const preset = g("preset");
    const area = g("area");
    const lux = g("lux");
    const uf = g("uf");
    const mf = g("mf");
    const lm = g("lm");

    if (preset) presetEl.value = preset;
    if (area) areaEl.value = area;
    if (lux) luxEl.value = lux;
    if (uf) ufEl.value = uf;
    if (mf) mfEl.value = mf;
    if (lm) luminaireEl.value = lm;
  }

  function updateUrlFromInputs(inp) {
    const u = new URL(location.href);
    u.searchParams.set("preset", inp.preset);
    u.searchParams.set("area", String(inp.area));
    u.searchParams.set("lux", String(inp.lux));
    u.searchParams.set("uf", String(inp.uf));
    u.searchParams.set("mf", String(inp.mf));
    u.searchParams.set("lm", String(inp.lm));
    history.replaceState({}, "", u.toString());
  }

  // Preset doldur
  function fillPresets() {
    presetEl.innerHTML = "";

    const opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = "Seç (avtomatik doldursun)…";
    presetEl.appendChild(opt0);

    for (const p of PRESETS) {
      const opt = document.createElement("option");
      opt.value = p.key;
      opt.textContent = p.name;
      presetEl.appendChild(opt);
    }
  }

  function applyPreset(key) {
    const p = PRESETS.find(x => x.key === key);
    if (!p) return;
    luxEl.value = p.lux;
    ufEl.value = p.uf;
    mfEl.value = p.mf;
  }

  // Hesab
  function calc(inp) {
    const { area, lux, uf, mf, lm } = inp;

    if (!(area > 0 && lux > 0 && uf > 0 && mf > 0 && lm > 0)) {
      return { ok: false, err: "Dəyərləri düz yaz: hamısı 0-dan böyük olmalıdır." };
    }
    if (uf > 1 || mf > 1) {
      return { ok: false, err: "UF və MF 1-dən böyük ola bilməz (adətən 0.5–0.85 arası)." };
    }

    const totalLumens = (lux * area) / (uf * mf);
    const n = ceilInt(totalLumens / lm);

    return { ok: true, totalLumens, n, layout: suggestGrid(n) };
  }

  // UI
  function setStatus(type, html) {
    statusEl.classList.remove("ok", "warn", "err");
    statusEl.classList.add(type);
    statusEl.innerHTML = html;
  }

  function render(inp, res) {
    heroMiniEl.innerHTML = "";
    whyBoxEl.innerHTML = "";
    detailsEl.innerHTML = "—";
    layoutHintEl.textContent = "—";

    if (!res.ok) {
      fixtureCountEl.textContent = "—";
      setStatus("err", res.err);
      detailsEl.innerHTML = `<b style="color:#991b1b">${res.err}</b>`;
      window.__lastResultText = "";
      return;
    }

    fixtureCountEl.textContent = res.n;
    layoutHintEl.textContent = `Təxmini yerləşmə: ${res.layout}`;

    setStatus("ok", `Hesablandı. Preset+faktorlar dəyişsən nəticə dərhal dəyişəcək.`);

    heroMiniEl.innerHTML = `
      <b>Ümumi lümen:</b> ${fmt(res.totalLumens, 0)} lm &nbsp; • &nbsp;
      <b>1 armatur:</b> ${fmt(inp.lm, 0)} lm
    `;

    const presetName = (PRESETS.find(p => p.key === inp.preset)?.name) || "—";
    detailsEl.innerHTML = `
      <div><b>Preset:</b> ${presetName}</div>
      <div><b>Sahə:</b> ${fmt(inp.area, 0)} m²</div>
      <div><b>Tələb:</b> ${fmt(inp.lux, 0)} lux</div>
      <div><b>UF:</b> ${fmt(inp.uf, 2)} &nbsp; <b>MF:</b> ${fmt(inp.mf, 2)}</div>
    `;

    const E = inp.lux, S = inp.area;
    const denom = inp.uf * inp.mf;
    const phiTotal = res.totalLumens;

    whyBoxEl.innerHTML = `
      <div style="margin-bottom:8px">Lümen metodu ilə hesab:</div>
      <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:12px; line-height:1.55;">
        Φ<sub>total</sub> = (E × S) / (UF × MF)<br>
        Φ<sub>total</sub> = (${fmt(E,0)} × ${fmt(S,0)}) / (${fmt(inp.uf,2)} × ${fmt(inp.mf,2)})<br>
        Φ<sub>total</sub> = ${fmt(E*S,0)} / ${fmt(denom,2)} = <b>${fmt(phiTotal,0)} lm</b><br><br>
        N = ceil(Φ<sub>total</sub> / Φ<sub>armatur</sub>)<br>
        N = ceil(${fmt(phiTotal,0)} / ${fmt(inp.lm,0)}) = <b>${res.n}</b>
      </div>
      <div style="margin-top:10px; color:#64748b; font-size:12px;">
        Qeyd: Bu hesab UGR, fotometriya və paylanma xəritəsini nəzərə almır. Dəqiq layihə üçün Dialux/Relux tövsiyə olunur.
      </div>
    `;

    window.__lastResultText = `İşıqlandırma Hesabı (lümen metodu)
Preset: ${presetName}
Sahə: ${fmt(inp.area,0)} m²
Tələb: ${fmt(inp.lux,0)} lux
UF: ${fmt(inp.uf,2)}
MF: ${fmt(inp.mf,2)}
1 armatur: ${fmt(inp.lm,0)} lm
Ümumi lümen: ${fmt(res.totalLumens,0)} lm
Tövsiyə olunan armatur sayı: ${res.n}
Təxmini yerləşmə: ${res.layout}
Qeyd: Bu hesab ilkin seçim üçündür (Dialux/Relux yoxlaması tövsiyə olunur).`;
  }

  function run() {
    const inp = getInputs();
    updateUrlFromInputs(inp);
    const res = calc(inp);
    render(inp, res);
  }

  // Events
  presetEl.addEventListener("change", () => {
    if (presetEl.value) applyPreset(presetEl.value);
    run();
  });

  calcBtn.addEventListener("click", run);

  copyBtn.addEventListener("click", async () => {
    const txt = window.__lastResultText;
    if (!txt) return alert("Əvvəlcə hesabla.");
    try {
      await navigator.clipboard.writeText(txt);
      alert("Kopyalandı.");
    } catch {
      alert("Brauzer icazə vermədi. Nəticəni əl ilə seçib kopyala.");
    }
  });

  if (infoBtn) {
    infoBtn.addEventListener("click", () => {
      alert(`UF (Utilization Factor):
Armaturdan çıxan işığın iş səthinə çatan hissəsi.
Optika, reflekslər, otaq ölçüsü təsir edir.

MF (Maintenance Factor):
Zamanla çirklənmə, lampanın zəifləməsi.
Adətən 0.75–0.85 arası götürülür.

Formula:
Ümumi lümen = (lux × sahə) / (UF × MF)
Armatur sayı = yuxarı yuvarlaqla (ümumi lümen / 1 armatur lümeni)

Bu alət ilkin seçim üçündür.
Dəqiq layihə üçün Dialux / Relux istifada olunur.);
    });
  }

  // Init
  fillPresets();
  setInputsFromParams();
  if (presetEl.value) applyPreset(presetEl.value);
  run();
}
