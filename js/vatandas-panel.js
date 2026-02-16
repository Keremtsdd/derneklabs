document.addEventListener('DOMContentLoaded', () => {
    const gtagScript = document.createElement('script');
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-T8D9BX0RJ1";
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    const gtagConfig = document.createElement('script');
    gtagConfig.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-T8D9BX0RJ1');
    `;
    document.head.appendChild(gtagConfig);

    const style = document.createElement('style');
    style.innerHTML = `
    /* Genel stil ayarları */
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
    
    body {
        font-family: 'Roboto', 'Open Sans', sans-serif;
        color: #202124;
    }
    
    /* Yardım butonu */
    .help-button {
        position: fixed;
        right: 20px;
        bottom: 100px;
        background-color: #d21000;
        color: white;
        border: none;
        border-radius: 24px;
        padding: 12px 24px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s, box-shadow 0.3s;
        z-index: 100;
    }
    .help-button:hover {
        background-color: #357ae8;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    
    /* Yan panel */
    .side-panel {
        position: fixed;
        right: -520px;
        top: 0;
        width: 520px;
        height: 100%;
        background-color: #ffffff;
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        transition: right 0.3s ease;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }
    
    /* Yan panel aktif durum */
    .side-panel.active {
        right: 0;
    }
    
    /* Yan panel kapanış butonu */
    .close-panel {
        background-color: #fbbc05;
        color: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
        text-align: center;
        line-height: 32px;
        font-size: 1.2rem;
        position: absolute;
        top: 16px;
        left: -40px;
        z-index: 10001;
    }
    
    /* Chat container */
    .chat-container {
        max-width: 100%;
        margin: 0;
        background-color: #ffffff;
        box-shadow: none;
        border-radius: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    /* Chat header */
    .chat-header {
        padding: 16px;
        background-color: #4285f4;
        color: #ffffff;
        text-align: center;
        font-weight: bold;
        position: relative;
    }
    
    /* Chat header kapanış butonu */
    .chat-header .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
        color: #ffffff;
        font-size: 1.4rem;
        cursor: pointer;
        z-index: 10001;
    }
    
    /* Chat box */
    .chat-box {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background-color: #f1f3f4;
        scroll-behavior: smooth;
    }
    
    /* Chat message */
    .chat-message {
        margin-bottom: 12px;
        position: relative;
        padding: 12px;
        border-radius: 12px;
        background-color: #fff;
    }

    /* Link kutuları */
    .chat-message a {
        display: inline-block;
        margin: 4px 0;
        border-radius: 20px;
        font-size: 16px;
        font-weight: 600;
        transition: background-color 0.3s ease, transform 0.2s ease;
        color: #dd0a0a;
        text-decoration:none;
    }
    .chat-message a:hover {
        color: #4285f4;
        text-decoration:none;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }
        
    /* Chat footer */
    .chat-footer {
        padding: 12px;
        background-color: #ffffff;
        border-top: 1px solid #e0e0e0;
    }
    
    /* Input group */
    .input-group .form-control {
        border-radius: 24px;
        border: 1px solid #e0e0e0;
        padding: 8px 12px;
    }
    
    /* Gönder butonu */
    .input-group .chat-submit-btn {
        border-radius: 24px;
        background-color: #34a853;
        color: white;
        border: none;
        padding: 8px 16px;
    }
    .input-group .chat-submit-btn:hover {
        background-color: #2c8c45;
    }
    
    /* Uyarı popup */
    .alert-popup {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #ea4335;
        color: white;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        display: none;
        font-size: 14px;
    }
    .alert-popup.active {
        display: block;
    }
    
    /* Yükleniyor ikonu */
    .loading-icon {
        display: none;
        width: 24px;
        height: 24px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #4285f4;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 10px auto;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Yazıyor göstergesi */
    .typing-indicator {
        font-style: italic;
        color: #5f6368;
        margin-top: 8px;
        display: none;
        font-size: 12px;
    }
    
    /* Buton grubu */
    .button-group {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }
    .button-group button {
        background-color: #4285f4;
        color: white;
        border: none;
        border-radius: 24px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 12px;
        transition: background-color 0.3s;
        flex-grow: 1;
    }
    .button-group button:hover {
        background-color: #357ae8;
    }
    
    /* Mobil uyumluluk */
    @media (max-width: 768px) {
        .side-panel {
            width: 100%;
            right: -100%;
        }
        .side-panel.active {
            right: 0;
        }
        .help-button {
            bottom: 20px;
        }
    }
    `;
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.3.7/purify.min.js';
    document.head.appendChild(script);

    script.onload = () => {
        const yardimButonu = document.createElement('button');
        yardimButonu.className = 'help-button';
        yardimButonu.textContent = 'Size nasıl yardımcı olabiliriz?';
        yardimButonu.id = 'help-button';
        document.body.appendChild(yardimButonu);

        const yanPanel = document.createElement('div');
        yanPanel.className = 'side-panel';
        yanPanel.id = 'side-panel';
        yanPanel.innerHTML = `
            <div class="chat-container">
                <div class="chat-header">
                    Vatandaş Web Destek - v1.0 Beta
                    <button class="close-btn" id="close-panel">&times;</button>
                </div>
                <div class="chat-box" id="chat-box">
                    <div class="chat-message alert alert-primary">
                       <p class="my-3"><strong>Hazır soruları kullanarak işlemlerinizi hızlandırabilirsiniz.</strong></p>
                       <p class="text-muted">Aradığınız terimle ilgili bir cevap alamazsanız, lütfen kelime bazlı arama yapmayı deneyin. Örneğin, "kreş", "ödeme", "etkinlik" gibi spesifik terimler kullanabilirsiniz.</p>
                        <div class="button-group">
                            <button class="info-button bg-success" data-message="Çözüm Merkezi">Çözüm Merkezi</button>
                            <button class="info-button bg-danger" data-message="Ödeme İşlemleri hakkında bilgi almak istiyorum.">Ödeme İşlemleri</button>
                            <button class="info-button" data-message="Bayrampaşa Kent Konseyi">Bayrampaşa Kent Konseyi</button>
                            <button class="info-button" data-message="İstihdam Merkezi">İstihdam Merkezi</button>
                            <button class="info-button" data-message="Evlendirme işlemleri hakkında bilgi almak istiyorum.">Evlendirme İşlemleri</button>
                            <button class="info-button" data-message="Etkinlikler hakkında bilgi almak istiyorum.">Etkinlikler</button>
                            <button class="info-button" data-message="Hizmet Merkezleri">Hizmet Merkezleri</button>
                            <button class="info-button" data-message="Staj hakkında bilgi almak istiyorum.">Staj İşlemleri</button>
                            <button class="info-button" data-message="Fotoğraf Galeri">Fotoğraf Galeri</button>
                            <button class="info-button" data-message="Eczaneler">Nöbetçi Eczaneler</button>
                            <button class="info-button" data-message="Son Haberler">Son Haberler</button>
                        </div>
                        <p class="my-3"><strong>Bayrampaşa Belediyesi(Bot):</strong> Merhaba! Size nasıl yardımcı olabilirim? 😊</p>
                    </div>
                </div>
                <div class="chat-footer">
                    <form id="chat-form">
                        <div class="input-group">
                            <input type="text" id="user-input" name="girdi" class="form-control" placeholder="Mesajınızı yazın...">
                            <button class="chat-submit-btn" type="submit" id="send-button">Gönder</button>
                        </div>
                    </form>
                    <div class="loading-icon" id="loading-icon"></div>
                    <div class="typing-indicator" id="typing-indicator">Bayrampaşa Belediyesi Botu yazıyor...</div>
                </div>
                <p class="text-muted text-center" style="font-size:11px;"> Bayrampaşa Belediyesi Bilgi İşlem Müdürlüğü tarafından ❤️ ile tasarlanmıştır.</p>
                <p class="text-muted text-center" style="font-size:11px;"> v1.0 - Durum: <span class="text-danger">Aktif</span></p>
            </div>
        `;
        document.body.appendChild(yanPanel);

        const uyariPopupElement = document.createElement('div');
        uyariPopupElement.className = 'alert-popup';
        uyariPopupElement.id = 'alert-popup';
        document.body.appendChild(uyariPopupElement);

        const panelDegistir = () => {
            document.getElementById('side-panel').classList.toggle('active');
        };

        const mesajGonder = async (mesaj, otomatik = false) => {
            const formData = new FormData();
            formData.append('input', mesaj);
            if (otomatik) {
                formData.append('otomatik_mesaj', 'true');
            }

            try {
                const response = await fetch('vatandas.php', {
                    method: 'POST',
                    body: formData
                });
                const veri = await response.text();
                const sohbetKutusu = document.getElementById('chat-box');
                sohbetKutusu.innerHTML += `
                    <div class="chat-message alert alert-success">
                        <strong>Bayrampaşa Belediyesi(Bot):</strong> ${veri}
                    </div>
                `;
                sohbetKutusu.scrollTop = sohbetKutusu.scrollHeight;
            } catch (hata) {
                console.error('Mesaj gönderimi sırasında bir hata oluştu:', hata);
            }
        };

        document.getElementById('help-button').addEventListener('click', panelDegistir);
        document.getElementById('close-panel').addEventListener('click', panelDegistir);

        const gonderButonu = document.getElementById('send-button');
        const girdi = document.getElementById('user-input');
        const sohbetKutusu = document.getElementById('chat-box');
        const yaziyorIndikatoru = document.getElementById('typing-indicator');
        const yukleniyorIkonu = document.getElementById('loading-icon');
        let mesajGonderiliyor = false;
        let sonMesajZamani = 0;

        const gonderButonuDevreDisiBirak = () => {
            gonderButonu.disabled = true;
        };

        const gonderButonuEtkinlestir = () => {
            gonderButonu.disabled = false;
            mesajGonderiliyor = false; 
        };

        const temizleHTML = (girdi) => {
            return DOMPurify.sanitize(girdi, { ALLOWED_TAGS: [] });
        };

        const manuelMesajGonder = async (mesaj) => {
            const temizlenmisGirdi = temizleHTML(mesaj).toLowerCase();
            const suankiZaman = new Date().getTime();

            if (mesajGonderiliyor || suankiZaman - sonMesajZamani < 1000) {
                uyariPopupElement.textContent = 'Lütfen 1 saniye bekleyin, sonra tekrar deneyin.';
                uyariPopupElement.classList.add('active');
                setTimeout(() => {
                    uyariPopupElement.classList.remove('active');
                }, 3000);
                sohbetKutusu.scrollTop = sohbetKutusu.scrollHeight;
                return;
            }

            mesajGonderiliyor = true; 
            sonMesajZamani = suankiZaman;
            gonderButonuDevreDisiBirak();

            sohbetKutusu.innerHTML += `
                <div class="chat-message alert alert-primary">
                    <strong>Siz:</strong> ${temizlenmisGirdi}
                </div>
            `;
            sohbetKutusu.scrollTop = sohbetKutusu.scrollHeight;

            yaziyorIndikatoru.style.display = 'block';
            girdi.value = '';

            try {
                const yanit = await fetch('vatandas.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ 'input': temizlenmisGirdi })
                });

                const veri = await yanit.text();
                const temizlenmisYanit = veri;

                sohbetKutusu.innerHTML += `
                    <div class="chat-message alert alert-success">
                        <strong>Bayrampaşa Belediyesi(Bot):</strong> ${temizlenmisYanit}
                    </div>
                `;
            } catch (hata) {
                console.error('Hata:', hata);
                sohbetKutusu.innerHTML += `
                    <div class="chat-message alert alert-danger">
                        <strong>Bayrampaşa Belediyesi(Bot):</strong> Üzgünüm, mesajınızı işleme koyarken bir hata oluştu.
                    </div>
                `;
            } finally {
                sohbetKutusu.scrollTop = sohbetKutusu.scrollHeight;
                yaziyorIndikatoru.style.display = 'none';
                setTimeout(gonderButonuEtkinlestir, 3000); 
            }
        };

        girdi.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                manuelMesajGonder(girdi.value);
            }
        });

        document.getElementById('chat-form').addEventListener('submit', (event) => {
            event.preventDefault();
            manuelMesajGonder(girdi.value);
        });

        document.getElementById('chat-box').addEventListener('click', (event) => {
            if (event.target.classList.contains('info-button')) {
                const message = event.target.getAttribute('data-message');
                manuelMesajGonder(message);
            }
        });
    };
});
