const terminal = document.getElementById('terminal');
const input = document.getElementById('input');

let balans = 1000;
let level = 1;
let xp = 0;
let username = '';
let inventar = [];
let hackStats = {uğur: 0, cəhd: 0};
let market = [
    { ad: "VPN", qiymet: 1500, təsir: "Hack uğur şansını +15%" },
    { ad: "Proxy", qiymet: 1000, təsir: "Cərimə riskini azaldır" },
    { ad: "Keylogger", qiymet: 2000, təsir: "Instagram və Facebook hack şansını +10%" },
    { ad: "Darknet Kit", qiymet: 3000, təsir: "Bütün hacklərdə +5% uğur" },
    { ad: "Enerji İçkisi", qiymet: 500, təsir: "Enerjini tam doldurur" }
];
let missiyalar = [
    { ad: "Bir bank hack et", komanda: "hack banka", mukafat: 500 },
    { ad: "Bir WiFi hack et", komanda: "hack wifi", mukafat: 200 },
    { ad: "Instagram hack et", komanda: "hack instagram", mukafat: 300 },
    { ad: "Facebook hack et", komanda: "hack facebook", mukafat: 400 },
    { ad: "Kripto birjasını hack et", komanda: "hack kripto", mukafat: 1200 },
    { ad: "Universitet serverini hack et", komanda: "hack universitet", mukafat: 900 }
];
let cariMissiya = null;

let liderler = [
    { ad: "Anonim", level: 5, balans: 8000 },
    { ad: "Ghost", level: 4, balans: 6000 },
    { ad: "Hacker", level: 3, balans: 4000 }
];


let hackLog = [];

function yaz(metin) {
    terminal.innerHTML += `<div style="color:#00ff99;">> ${metin}</div>`;
    terminal.scrollTop = terminal.scrollHeight;
}
function cavab(metin, color="#fff") {
    terminal.innerHTML += `<div style="color:${color};">${metin}</div>`;
    terminal.scrollTop = terminal.scrollHeight;
}
function yenileStatus() {
    let bar = xpBar();
    cavab(`👤 <b>${username}</b> | 🏅 Səviyyə: <b>${level}</b> | 💰 Pul: <b>${balans} AZN</b> | ⭐ XP: <b>${xp}</b> ${bar}`);
}
function xpBar() {
    let max = level*100, percent = Math.min(100, Math.floor(xp/max*100));
    let bar = `<span style="display:inline-block;width:120px;background:#222;border-radius:5px;overflow:hidden;">
        <span style="display:inline-block;width:${percent}px;height:10px;background:#00ff99;"></span>
    </span> <span style="font-size:12px;">${percent}%</span>`;
    return bar;
}
function yoxlaLevel() {
    if (xp >= level * 100) {
        level++;
        xp = 0;
        cavab(`🎉 <b>Səviyyə artdı!</b> Yeni səviyyə: <b>${level}</b>`, "#00ff99");
    }
}
function hackUgur(ehtimal, tip) {
    let bonus = 0;
    if (inventar.includes("VPN")) bonus += 0.15;
    if (inventar.includes("Darknet Kit")) bonus += 0.05;
    if (tip && inventar.includes("Keylogger") && (tip==="instagram"||tip==="facebook")) bonus += 0.10;
    return Math.random() < (ehtimal + bonus);
}
function hackCərimə() {
    return inventar.includes("Proxy") ? 100 : 300;
}
function missiyaVer() {
    cariMissiya = missiyalar[Math.floor(Math.random()*missiyalar.length)];
    cavab(`🕵️ Yeni missiya: <b>${cariMissiya.ad}</b> (${cariMissiya.komanda}) — Mükafat: ${cariMissiya.mukafat} AZN`, "#00e6e6");
}
function yoxlaMissiya(komanda) {
    if (cariMissiya && komanda === cariMissiya.komanda) {
        balans += cariMissiya.mukafat;
        cavab(`✅ Missiyanı tamamladınız! ${cariMissiya.mukafat} AZN qazandınız.`, "#00ff99");
        cariMissiya = null;
        setTimeout(missiyaVer, 2000);
    }
}
function statistik() {
    let faiz = hackStats.cəhd ? Math.round(hackStats.uğur/hackStats.cəhd*100) : 0;
    cavab(`📊 Hack statistikası: Uğur: ${hackStats.uğur}, Cəhd: ${hackStats.cəhd}, Uğur faizi: ${faiz}%`, "#b3ffb3");
}
function bonus() {
    let bonuslar = [
        {text: "💸 Pul bonusu!", value: 500 + Math.floor(Math.random()*1000), type: "pul"},
        {text: "⚡ Enerji bonusu!", value: 3, type: "enerji"},
        {text: "⭐ XP bonusu!", value: 50 + Math.floor(Math.random()*50), type: "xp"}
    ];
    let secim = bonuslar[Math.floor(Math.random()*bonuslar.length)];
    if (secim.type === "pul") {
        balans += secim.value;
        cavab(`🎁 <b>${secim.text}</b> +${secim.value} AZN`, "#ff0");
    } else if (secim.type === "enerji") {
        enerji = Math.min(10, enerji + secim.value);
        cavab(`🎁 <b>${secim.text}</b> +${secim.value} enerji (cəmisi ${enerji}/10)`, "#00ff99");
    } else if (secim.type === "xp") {
        xp += secim.value;
        cavab(`🎁 <b>${secim.text}</b> +${secim.value} XP`, "#00e6e6");
        yoxlaLevel();
    }
    yenileStatus();
}

function start() {
    terminal.innerHTML = '';
    cavab("Xoş gəlmisiniz! Zəhmət olmasa istifadəçi adınızı yazın:", "#00e6e6");
    input.value = '';
    input.placeholder = "İstifadəçi adı...";
    input.removeEventListener('keydown', komandaListener);
    input.addEventListener('keydown', adListener);
}
function adListener(e) {
    if (e.key === 'Enter') {
        username = input.value.trim() || "Hacker";
        cavab(`Salam, <b>${username}</b>! 'help' yazaraq komandaları görə bilərsiniz.`, "#00ff99");
        input.value = '';
        input.placeholder = "Komanda yazın və Enter basın...";
        input.removeEventListener('keydown', adListener);
        input.addEventListener('keydown', komandaListener);
        setTimeout(missiyaVer, 1500);
    }
}
function komandaListener(e) {
    if (e.key === 'Enter') {
        const komanda = input.value.trim();
        yaz(komanda);
        yoxlaKomanda(komanda.toLowerCase());
        input.value = '';
    }
}
let risk = 0;
function yoxlaKomanda(komanda) {
    if (komanda === 'help') {
        cavab("Komandalar: <br> <b>help</b>, <b>hack banka</b>, <b>hack wifi</b>, <b>hack instagram</b>, <b>hack facebook</b>, <b>status</b>, <b>upgrade</b>, <b>info</b>, <b>market</b>, <b>al [əşyə]</b>, <b>inventar</b>, <b>profil</b>, <b>missiya</b>, <b>statistika</b>, <b>clear</b>", "#b3ffb3");
    } else if (komanda === 'hack banka') {
        hackStats.cəhd++;
        if (enerji <= 0) { cavab("Enerjiniz bitib!", "#ff4444"); return; }
        enerji--;
        hackLoading(() => {
            if (hackUgur(0.6)) {
                let qazan = 500 + Math.floor(Math.random() * 1000);
                balans += qazan;
                xp += 20;
                hackStats.uğur++;
                cavab(`💸 Bank sisteminə daxil olunur... <b>Uğur!</b> ${qazan} AZN qazandınız.`, "#00ff99");
                hackLog.push({komanda, netice: "Uğur", tarix: new Date().toLocaleString()});
            } else {
                let cerime = hackCərimə();
                balans -= cerime;
                cavab(`❌ Bank sisteminə daxil olunur... Təəssüf, uğursuz oldu və <b>${cerime} AZN</b> cərimə olundunuz!`, "#ff4444");
                xp += 5;
                hackLog.push({komanda, netice: "Uğursuz", tarix: new Date().toLocaleString()});
            }
            yoxlaLevel();
            yoxlaMissiya(komanda);
        });
        return;
    } else if (komanda === 'hack wifi') {
        hackStats.cəhd++;
        if (hackUgur(0.8)) {
            cavab("📶 WiFi şifrəsi tapılır... Şifrə: <b>'qwerty123'</b>", "#00ff99");
            xp += 10;
            hackStats.uğur++;
            hackLog.push({komanda, netice: "Uğur", tarix: new Date().toLocaleString()});
        } else {
            cavab("❌ WiFi şifrəsi tapılır... Təəssüf, uğursuz oldu.", "#ff4444");
            xp += 2;
            hackLog.push({komanda, netice: "Uğursuz", tarix: new Date().toLocaleString()});
        }
        yoxlaLevel();
        yoxlaMissiya(komanda);
    } else if (komanda === 'hack instagram') {
        hackStats.cəhd++;
        if (hackUgur(0.4, "instagram")) {
            balans += 300;
            xp += 30;
            hackStats.uğur++;
            cavab("📸 Instagram hesabı sındırıldı! 300 AZN qazandınız.", "#00ff99");
            hackLog.push({komanda, netice: "Uğur", tarix: new Date().toLocaleString()});
        } else {
            cavab("❌ Instagram hesabı sındırıla bilmədi.", "#ff4444");
            xp += 5;
            hackLog.push({komanda, netice: "Uğursuz", tarix: new Date().toLocaleString()});
        }
        yoxlaLevel();
        yoxlaMissiya(komanda);
    } else if (komanda === 'hack facebook') {
        hackStats.cəhd++;
        if (hackUgur(0.3, "facebook")) {
            balans += 400;
            xp += 35;
            hackStats.uğur++;
            cavab("📘 Facebook hesabı sındırıldı! 400 AZN qazandınız.", "#00ff99");
            hackLog.push({komanda, netice: "Uğur", tarix: new Date().toLocaleString()});
        } else {
            let cerime = hackCərimə();
            balans -= cerime;
            cavab(`❌ Facebook hack uğursuz oldu və ${cerime} AZN cərimə olundunuz!`, "#ff4444");
            xp += 7;
            hackLog.push({komanda, netice: "Uğursuz", tarix: new Date().toLocaleString()});
        }
        yoxlaLevel();
        yoxlaMissiya(komanda);
    } else if (komanda === 'hack kripto') {
        hackStats.cəhd++;
        if (hackUgur(0.65)) {
            let qazan = 1200 + Math.floor(Math.random() * 800);
            balans += qazan;
            xp += 25;
            hackStats.uğur++;
            cavab(`💰 Kripto birjasına daxil olunur... <b>Uğur!</b> ${qazan} AZN qazandınız.`, "#00ff99");
            hackLog.push({komanda, netice: "Uğur", tarix: new Date().toLocaleString()});
        } else {
            let cerime = hackCərimə();
            balans -= cerime;
            cavab(`❌ Kripto birjasına daxil olunur... Təəssüf, uğursuz oldu və <b>${cerime} AZN</b> cərimə olundunuz!`, "#ff4444");
            xp += 10;
            hackLog.push({komanda, netice: "Uğursuz", tarix: new Date().toLocaleString()});
        }
        yoxlaLevel();
        yoxlaMissiya(komanda);
    } else if (komanda === 'hack universitet') {
        hackStats.cəhd++;
        if (hackUgur(0.55)) {
            let qazan = 900 + Math.floor(Math.random() * 600);
            balans += qazan;
            xp += 22;
            hackStats.uğur++;
            cavab(`🏫 Universitet serverinə daxil olunur... <b>Uğur!</b> ${qazan} AZN qazandınız.`, "#00ff99");
            hackLog.push({komanda, netice: "Uğur", tarix: new Date().toLocaleString()});
        } else {
            let cerime = hackCərimə();
            balans -= cerime;
            cavab(`❌ Universitet serverinə daxil olunur... Təəssüf, uğursuz oldu və <b>${cerime} AZN</b> cərimə olundunuz!`, "#ff4444");
            xp += 8;
            hackLog.push({komanda, netice: "Uğursuz", tarix: new Date().toLocaleString()});
        }
        yoxlaLevel();
        yoxlaMissiya(komanda);
    } else if (komanda === 'status' || komanda === 'profil') {
        yenileStatus();
    } else if (komanda === 'upgrade') {
        if (balans >= 2000) {
            balans -= 2000;
            level++;
            cavab("⬆️ Təbriklər! Səviyyəniz artdı.", "#00ff99");
        } else {
            cavab("Səviyyə artırmaq üçün kifayət qədər pulunuz yoxdur.", "#ff4444");
        }
        yenileStatus();
    } else if (komanda === 'info') {
        cavab("Bu oyun sadə hacker simulyatorudur. Komandaları yazın və səviyyənizi artırın! Yeni əşyalar almaq üçün <b>market</b> yazın. Missiyalar üçün <b>missiya</b> yazın.", "#b3ffb3");
    } else if (komanda === 'market') {
        let msg = "<b>Marketdə mövcud əşyalar:</b><br>";
        market.forEach(item => {
            msg += `- <b>${item.ad}</b> (${item.qiymet} AZN): ${item.təsir}<br>`;
        });
        msg += "Almaq üçün: <b>al [əşyə adı]</b> yazın. Məs: al vpn";
        cavab(msg, "#00e6e6");
    } else if (komanda.startsWith('al ')) {
        let esya = komanda.slice(3).trim().toUpperCase();
        let item = market.find(i => i.ad.toUpperCase() === esya);
        if (!item) {
            cavab("Belə bir əşyə yoxdur.", "#ff4444");
        } else if (balans < item.qiymet) {
            cavab("Bu əşyəni almaq üçün kifayət qədər pulunuz yoxdur.", "#ff4444");
        } else if (inventar.includes(item.ad)) {
            cavab("Bu əşyə artıq inventarınızda var.", "#ff4444");
        } else {
            balans -= item.qiymet;
            inventar.push(item.ad);
            cavab(`✅ <b>${item.ad}</b> alındı və inventarınıza əlavə olundu!`, "#00ff99");
            yenileStatus();
        }
    } else if (komanda === 'inventar') {
        if (inventar.length === 0) {
            cavab("Inventarınız boşdur.", "#b3ffb3");
        } else {
            cavab("Inventar: " + inventar.map(e=>`<b>${e}</b>`).join(', '), "#b3ffb3");
        }
    } else if (komanda === 'clear') {
        terminal.innerHTML = '';
    } else if (komanda === 'missiya') {
        if (cariMissiya) {
            cavab(`Cari missiya: <b>${cariMissiya.ad}</b> (${cariMissiya.komanda}) — Mükafat: ${cariMissiya.mukafat} AZN`, "#00e6e6");
        } else {
            missiyaVer();
        }
    } else if (komanda === 'statistika') {
        statistik();
    } else if (komanda === 'ul') {
        bonus();
    } else if (komanda === '') {
    } else {
        cavab("Naməlum komanda. <b>help</b> yazın.", "#ff4444");
    }
}

function showScreen(type) {
    let html = "";
    if (type === "profil") {
        html = `<h2>Profil</h2>
        <div style="text-align:center;">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}" width="80" style="border-radius:50%;border:2px solid #00ff99;margin-bottom:10px;">
            <div style="margin:10px 0;">
                <b>İstifadəçi:</b> ${username}<br>
                <b>Səviyyə:</b> ${level}<br>
                <b>Pul:</b> ${balans} AZN<br>
                <b>XP:</b> ${xp} ${xpBar()}
            </div>
            <div><b>Inventar:</b> ${inventar.length ? inventar.join(', ') : 'Boş'}</div>
        </div>`;
    } else if (type === "market") {
        html = `<h2>Market</h2>`;
        market.forEach(item => {
            let icon = item.ad === "VPN" ? "🛡️" : item.ad === "Proxy" ? "🌐" : item.ad === "Keylogger" ? "⌨️" : item.ad === "Darknet Kit" ? "💼" : "🔧";
            html += `<div style="margin-bottom:8px;">
                ${icon} <b>${item.ad}</b> (${item.qiymet} AZN): ${item.təsir}
                ${inventar.includes(item.ad) ? '<span style="color:#ff0;"> (Alınıb)</span>' : `<button onclick="alModal('${item.ad}')">Al</button>`}
            </div>`;
        });
    } else if (type === "missiya") {
        if (cariMissiya) {
            html = `<h2>Missiya</h2>
            <p><b>${cariMissiya.ad}</b></p>
            <p>Komanda: <b>${cariMissiya.komanda}</b></p>
            <p>Mükafat: <b>${cariMissiya.mukafat} AZN</b></p>`;
        } else {
            html = `<h2>Missiya</h2><p>Hazırda aktiv missiya yoxdur.</p>`;
        }
    } else if (type === "statistika") {
        let faiz = hackStats.cəhd ? Math.round(hackStats.uğur/hackStats.cəhd*100) : 0;
        html = `<h2>Statistika</h2>
        <p>Uğurlu hack: <b>${hackStats.uğur}</b></p>
        <p>Cəhd sayı: <b>${hackStats.cəhd}</b></p>
        <p>Uğur faizi: <b>${faiz}%</b></p>`;
    } else if (type === "liderler") {
        html = `<h2>Liderlər</h2><ol>`;
        liderler.concat([{ad: username, level, balans}])
            .sort((a,b)=>b.level-b.level || b.balans-a.balans)
            .forEach(l => {
                let style = l.ad === username ? ' style="color:#ff0;font-weight:bold;"' : '';
                html += `<li${style}><b>${l.ad}</b> — Səviyyə: ${l.level}, Pul: ${l.balans} AZN</li>`;
            });
        html += `</ol>`;
    } else if (type === "log") {
        html = `<h2>Hack Tarixi</h2>`;
        if (hackLog.length === 0) html += "<p>Hələ heç bir hack cəhdi yoxdur.</p>";
        else hackLog.slice(-20).reverse().forEach(l =>
            html += `<div>${l.tarix}: <b>${l.komanda}</b> — ${l.netice}</div>`
        );
    } else if (type === "lab") {
        html = `<h2>Təhlükəsizlik Laboratoriyası</h2>
        <p>Burada yeni hack alətləri hazırlaya və ya mövcud alətləri təkmilləşdirə bilərsiniz.</p>
        <button onclick="hazirlaAlat('Firewall Bypass')">Firewall Bypass hazırla (2000 AZN)</button>
        <button onclick="hazirlaAlat('Brute Force Tool')">Brute Force Tool hazırla (2500 AZN)</button>`;
    } else if (type === "forum") {
        html = `<h2>Forum</h2>
    <div id="forum-messages" style="max-height:200px;overflow-y:auto;margin-bottom:10px;">`;
        forumMessages.forEach(m => {
            html += `<div><b>${m.ad}:</b> ${m.mesaj}</div>`;
        });
        html += `</div>
    <form id="forum-form" onsubmit="return false;">
        <input id="forum-input" type="text" placeholder="Mesaj yaz..." style="width:70%;margin-right:8px;">
        <button type="submit">Göndər</button>
    </form>`;
    } else if (type === "gizli") {
        html = `<h2>Gizli Tapşırıqlar</h2>
        <p>Tapşırıq: 3 dəfə uğurla hack et və 1000 AZN bonus qazan!</p>`;
    }
    document.getElementById('modal').innerHTML = html;
    document.getElementById('modal-bg').style.display = "block";
    document.getElementById('modal').style.display = "block";
    if (type === "forum") {
        setTimeout(() => {
            document.getElementById('forum-form').onsubmit = function() {
                let val = document.getElementById('forum-input').value.trim();
                if(val) {
                    forumMessages.push({ad: username, mesaj: val});
                    let lower = val.toLowerCase();
                    forumAutoReplies.forEach(obj => {
                        if (obj.keywords.some(word => lower.includes(word))) {
                            setTimeout(() => {
                                forumMessages.push({ad: obj.reply.split(":")[0], mesaj: obj.reply.split(":")[1].trim()});
                                showScreen('forum');
                            }, 1000 + Math.random()*1000);
                        }
                    });
                    showScreen('forum');
                }
                return false;
            };
            document.getElementById('forum-input').focus();
        }, 50);
    }
}
function closeModal() {
    document.getElementById('modal-bg').style.display = "none";
    document.getElementById('modal').style.display = "none";
}
function clearTerminal() {
    terminal.innerHTML = '';
}
function alModal(ad) {
    let item = market.find(i => i.ad === ad);
    if (!item) return;
    if (balans < item.qiymet) {
        alert("Kifayət qədər pul yoxdur!");
        return;
    }
    if (ad === "Enerji İçkisi") {
        balans -= item.qiymet;
        enerji = 10;
        alert("Enerjiniz tam doldu!");
        closeModal();
        return;
    }
    if (inventar.includes(item.ad)) {
        alert("Bu əşyə artıq inventardadır!");
        return;
    }
    balans -= item.qiymet;
    inventar.push(item.ad);
    alert(item.ad + " alındı!");
    closeModal();
}

function hazirlaAlat(ad) {
    let qiymet = ad === "Firewall Bypass" ? 2000 : 2500;
    if (balans < qiymet) return alert("Kifayət qədər pul yoxdur!");
    if (inventar.includes(ad)) return alert("Bu alət artıq var!");
    balans -= qiymet;
    inventar.push(ad);
    alert(ad + " hazırlandı və inventara əlavə olundu!");
    closeModal();
}

let enerji = 10;
function updateProfileBar() {
    document.getElementById('avatar').src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;
    document.getElementById('profile-info').innerHTML = `
        <b>${username}</b><br>
        🏅 Səviyyə: <b>${level}</b> | 💰 <b>${balans} AZN</b><br>
        ⭐ XP: <b>${xp}</b> | ⚡ Enerji: <b>${enerji}/10</b> | 🚨 Risk: <b>${risk}%</b>
    `;
}
setInterval(updateProfileBar, 1000);

setInterval(() => {
    if (enerji < 10) enerji++;
}, 180000);
let newsVisible = true;

function toggleNewsPanel() {
    newsVisible = !newsVisible;
    document.getElementById('news-panel').style.display = newsVisible ? "block" : "none";
    document.getElementById('news-toggle').style.display = newsVisible ? "none" : "block";
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('news-panel').style.display = "block";
    document.getElementById('news-toggle').style.display = "none";
});

const newsList = [
    "💥 Yeni bank hack olundu! 2 milyon AZN oğurlandı.",
    "🌐 Qlobal internetdə təhlükəsizlik zəifliyi aşkarlandı.",
    "🛡️ VPN istifadə edənlərin uğur faizi artdı.",
    "📱 Instagram-da yeni açıq tapıldı.",
    "💸 Kriptovalyuta bazarında böyük hack!"
];
function updateNewsPanel() {
    const panel = document.getElementById('news-content');
    let idx = Math.floor(Math.random() * newsList.length);
    panel.innerHTML = `<b>Xəbərlər</b><hr>${newsList[idx]}`;
}
setInterval(updateNewsPanel, 7000);
updateNewsPanel();

let forumMessages = [
    {ad: "Anonim", mesaj: "Kim bank hack edib? Məsləhət lazımdır!"},
    {ad: "Ghost", mesaj: "VPN olmadan hack etməyin, risklidir!"},
];
setInterval(()=>{
    if(Math.random()<0.3) {
        let botlar = ["Anonim", "Ghost", "Hacker"];
        let mesajlar = ["Yeni açıq tapdım!", "Səviyyəm artdı!", "Marketdə endirim var!"];
        forumMessages.push({ad: botlar[Math.floor(Math.random()*botlar.length)], mesaj: mesajlar[Math.floor(Math.random()*mesajlar.length)]});
    }
}, 12000);

start();

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    document.getElementById('theme-toggle').textContent =
        document.body.classList.contains('light-theme') ? "☀️" : "🌙";
}

function updateProfileBar() {
    document.getElementById('avatar').src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;
    document.getElementById('profile-info').innerHTML = `
        <b>${username}</b><br>
        🏅 Səviyyə: <b>${level}</b> | 💰 <b>${balans} AZN</b><br>
        ⭐ XP: <b>${xp}</b> | ⚡ Enerji: <b>${enerji}/10</b> | 🚨 Risk: <b>${risk}%</b>
    `;
}
setInterval(updateProfileBar, 1000);

function dailyBonus() {
    let last = localStorage.getItem("lastBonus");
    let today = new Date().toLocaleDateString();
    if (last !== today) {
        balans += 500;
        cavab("🎁 Gündəlik bonus: 500 AZN qazandınız!", "#ff0");
        localStorage.setItem("lastBonus", today);
    }
}
dailyBonus();

function randomEvent() {
    if (Math.random() < 0.1) {
        let bonus = 200 + Math.floor(Math.random()*500);
        balans += bonus;
        cavab(`⚡ Sürpriz: Sistem açığı tapdınız və ${bonus} AZN qazandınız!`, "#ff0");
    }
}
setInterval(randomEvent, 60000);

const forumAutoReplies = [
    { keywords: ["bank", "pul", "hack banka"], reply: "Anonim: Bank hack etmək üçün VPN istifadə et, risk azalır!" },
    { keywords: ["wifi", "şifrə", "hack wifi"], reply: "Ghost: WiFi hack üçün ən yaxşı yol 'aircrack' proqramıdır." },
    { keywords: ["instagram", "insta", "hack instagram"], reply: "Hacker: Keylogger al, uğur şansın artsın!" },
    { keywords: ["facebook", "fb", "hack facebook"], reply: "Anonim: Facebook üçün ən çətin hissə 2FA-dır, diqqətli ol!" },
    { keywords: ["enerji", "yoruldum"], reply: "Ghost: Enerji içkisi al, enerjin tam dolacaq!" },
    { keywords: ["risk", "polis"], reply: "Anonim: Risk 100% olarsa, polis səni tuta bilər, ehtiyatlı ol!" },
    { keywords: ["market", "əşyə", "al"], reply: "Hacker: Marketdə VPN və Proxy ən vacib əşyalardır." },
    { keywords: ["missiya", "tapşırıq"], reply: "Ghost: Missiyanı yerinə yetir, əlavə pul və XP qazan!" },
    { keywords: ["kripto", "kriptovalyuta"], reply: "Anonim: Kripto birjasını hack etmək çətindir, amma qazancı böyükdür." },
    { keywords: ["universitet", "server"], reply: "Hacker: Universitet serverləri üçün Brute Force Tool hazırla." },
    { keywords: ["salam", "sagol", "salamlar"], reply: "Ghost: Salam! Uğurlar!" },
    { keywords: ["forum", "mesaj"], reply: "Anonim: Forumda sual ver, kömək edərik!" },
    { keywords: ["bonus", "ul"], reply: "Hacker: 'ul' komandasını yaz, bonus qazan!" },
    { keywords: ["statistika", "uğur"], reply: "Ghost: Statistika səhifəsində uğur faizini görə bilərsən." },
    { keywords: ["laboratoriya", "alat", "hazırla"], reply: "Anonim: Laboratoriyada yeni hack alətləri hazırlamaq mümkündür." }
];