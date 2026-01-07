function calc(){
  const S = Number(area.value);
  const E = Number(lux.value);
  const UF = Number(uf.value);
  const MF = Number(mf.value);
  const lm = Number(luminaire.value);

  if(!(S>0 && E>0 && UF>0 && MF>0 && lm>0)){
    alert("Bütün dəyərlər 0-dan böyük olmalıdır");
    return;
  }

  const totalLumens = (E * S) / (UF * MF);
  const count = Math.ceil(totalLumens / lm);

  document.getElementById("fixtureCount").textContent = count;

  document.getElementById("details").innerHTML = `
    <b>Ümumi lümen ehtiyacı:</b> ${totalLumens.toFixed(0)} lm<br>
    <b>1 armatur:</b> ${lm} lm<br>
    <b>Təxmini yerləşmə:</b> ${count <= 4 ? "1×"+count : "2×"+Math.ceil(count/2)}
  `;

  document.getElementById("result").classList.remove("hidden");

  window.__copy = `
İşıqlandırma Hesabı (Lümen metodu)
Sahə: ${S} m²
Lux: ${E}
UF: ${UF}
MF: ${MF}
Ümumi lümen: ${totalLumens.toFixed(0)} lm
Armatur sayı: ${count}
`;
}

calcBtn.onclick = calc;

copyBtn.onclick = async () => {
  if(!window.__copy) return alert("Əvvəlcə hesabla");
  await navigator.clipboard.writeText(window.__copy);
  alert("Kopyalandı");
};
