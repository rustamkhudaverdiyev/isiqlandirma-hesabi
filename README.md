# 💡 İşıqlandırma Hesabı (Lümen Metodu)

Bu alət **lümen metodu** əsasında daxili məkanlar üçün ilkin işıqlandırma hesabını aparmaq üçün hazırlanmışdır.  
Mühəndislər və layihəçilər üçün **sürətli, sadə və praktik** istifadəyə yönəlib.

🔗 Canlı demo:  
https://rustamkhudaverdiyev.github.io/isiqlandirma-hesabi/

---

## 📌 Nə edir?
Aşağıdakı parametrlərə əsasən:
- Lazım olan **ümumi lümen** miqdarını
- Tövsiyə olunan **armatur sayını**
hesablayır.

Bu hesab **ilkin seçim** üçündür və detallı layihə üçün Dialux / Relux ilə yoxlama tövsiyə olunur.

---

## 🧮 Hesab Metodu
İstifadə olunan əsas düstur:
Φ_total = (E × S) / (UF × MF)


Harada:
- **E** – tələb olunan işıqlanma (lux)
- **S** – sahə (m²)
- **UF** – Utilization Factor
- **MF** – Maintenance Factor

Armatur sayı:
N = ceil(Φ_total / Φ_armatur)


---

## 🧾 Giriş Parametrləri
- Sahə (m²)
- Tələb olunan işıqlanma (lux)
- Utilization Factor (UF)
- Maintenance Factor (MF)
- 1 armaturun işıq axını (lm)

---

## 📤 Çıxış
- Ümumi lümen ehtiyacı
- Tövsiyə olunan armatur sayı
- Sadə yerləşmə təklifi (məs: 2×3)
- Kopyalana bilən nəticə mətni

---

## ⚠️ Qeyd
Bu alət:
- Kabel seçimi
- Selektivlik
- Parıltı (UGR)
- Detallı paylanma

kimi məsələləri **əhatə etmir**. Bunlar sahədə və ya xüsusi proqramlarda ayrıca yoxlanmalıdır.

---

## 🛠️ Texnologiyalar
- HTML
- CSS (modern UI / glassmorphism)
- Vanilla JavaScript
- GitHub Pages

---

## 👤 Müəllif
**Rustam Khudaverdiyev**  
Elektrik mühəndisi

---

## 📄 Lisenziya
Bu layihə açıq istifadəlidir. Tədris və şəxsi layihələr üçün sərbəstdir.
