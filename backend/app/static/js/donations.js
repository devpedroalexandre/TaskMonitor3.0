// ============================================
// TASKMONITOR 3.0 - DONATIONS MODULE
// ✅ VERSÃO CORRIGIDA - ÍCONES OFICIAIS DAS CRIPTOS
// ============================================

// === CRYPTO WALLET ADDRESSES ===
const cryptoWallets = {
    bitcoin: {
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        name: 'Bitcoin',
        symbol: 'BTC',
        color: '#F7931A',
        gradient: 'linear-gradient(135deg, #F7931A 0%, #FFA726 100%)',
        // ✅ SVG INLINE DO BITCOIN (logo oficial laranja)
        icon: `<svg width="40" height="40" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
                <circle cx="16" cy="16" r="16" fill="#F7931A"/>
                <path fill="#FFF" fill-rule="nonzero" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/>
            </g>
        </svg>`
    },
    ethereum: {
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        name: 'Ethereum',
        symbol: 'ETH',
        color: '#627EEA',
        gradient: 'linear-gradient(135deg, #627EEA 0%, #8A9FF1 100%)',
        // ✅ SVG INLINE DO ETHEREUM (logo oficial roxo/azul)
        icon: `<svg width="40" height="40" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
                <circle cx="16" cy="16" r="16" fill="#627EEA"/>
                <g fill="#FFF" fill-rule="nonzero">
                    <path fill-opacity=".602" d="M16.498 4v8.87l7.497 3.35z"/>
                    <path d="M16.498 4L9 16.22l7.498-3.35z"/>
                    <path fill-opacity=".602" d="M16.498 21.968v6.027L24 17.616z"/>
                    <path d="M16.498 27.995v-6.028L9 17.616z"/>
                    <path fill-opacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/>
                    <path fill-opacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/>
                </g>
            </g>
        </svg>`
    },
    litecoin: {
        address: 'ltc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el',
        name: 'Litecoin',
        symbol: 'LTC',
        color: '#345D9D',
        gradient: 'linear-gradient(135deg, #345D9D 0%, #5B8AC9 100%)',
        // ✅ SVG INLINE DO LITECOIN (logo oficial azul)
        icon: `<svg width="40" height="40" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
                <circle cx="16" cy="16" r="16" fill="#345D9D"/>
                <path fill="#FFF" fill-rule="nonzero" d="M10.427 19.214L9 19.768l.688-2.759 1.444-.58L13.213 8h5.129l-1.519 6.196 1.41-.571-.68 2.75-1.427.571-.848 3.483H23L22.127 24H9.252z"/>
            </g>
        </svg>`
    },
    solana: {
        address: 'HWEpQX38jtA1rv5MFahNJfWGoK7o7xVF8ZhXXCUjGnww',
        name: 'Solana',
        symbol: 'SOL',
        color: '#14F195',
        gradient: 'linear-gradient(135deg, #DC1FFF 0%, #00FFA3 50%, #03E1FF 100%)',
        // ✅ SVG INLINE DO SOLANA (logo oficial preto com gradiente)
        icon: `<svg width="40" height="40" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="solana-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#DC1FFF;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#00FFA3;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#03E1FF;stop-opacity:1" />
                </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="16" fill="url(#solana-grad)"/>
            <g fill="#000" fill-rule="nonzero">
                <path d="M9.874 18.299a.554.554 0 01.393-.162h16.073c.33 0 .495.398.262.63l-3.04 3.031a.554.554 0 01-.393.162H7.096c-.33 0-.495-.398-.262-.63l3.04-3.031z"/>
                <path d="M9.874 7.832a.564.564 0 01.393-.162h16.073c.33 0 .495.398.262.63l-3.04 3.031a.554.554 0 01-.393.162H7.096c-.33 0-.495-.398-.262-.63l3.04-3.031z"/>
                <path d="M22.126 13.054a.554.554 0 00-.393-.162H5.66c-.33 0-.495.398-.262.63l3.04 3.031c.105.104.246.162.393.162h16.073c.33 0 .495-.398.262-.63l-3.04-3.031z"/>
            </g>
        </svg>`
    }
};

// === PAYMENT LINKS ===
const pixKey = 'seuemail@example.com'; // Substitua pelo seu PIX real
const mercadoPagoLink = 'https://mpago.la/SEU_LINK_AQUI'; // Substitua pelo seu link do Mercado Pago
const stripeLink = 'https://buy.stripe.com/SEU_LINK_AQUI'; // Alternativa: Stripe

// === DONATION MODAL CONTENT ===
function loadDonationInfo() {
    const donationMethods = document.getElementById('donationMethods');
    if (!donationMethods) return;
    
    let html = `
        <!-- CARTÃO DE CRÉDITO -->
        <div class="donation-section">
            <h3 class="donation-section-title">
                <span class="icon">💳</span>
                Cartão de Crédito / Débito
            </h3>
            <div class="payment-info">
                <div class="payment-card featured">
                    <div class="payment-header">
                        <div class="card-brands">
                            <span class="brand-icon" title="Visa">💳</span>
                            <span class="brand-icon" title="Mastercard">💳</span>
                            <span class="brand-icon" title="American Express">💳</span>
                            <span class="brand-icon" title="Elo">💳</span>
                        </div>
                        <span class="payment-name">Todas as Bandeiras</span>
                    </div>
                    <p class="payment-description">
                        Pagamento seguro via <strong>Mercado Pago</strong><br>
                        <small>✓ Parcelamento disponível • ✓ Checkout seguro</small>
                    </p>
                    <button class="btn-donate" onclick="openPaymentLink('mercadopago')">
                        <span class="icon">💎</span>
                        Doar com Cartão
                    </button>
                </div>
            </div>
        </div>

        <!-- PIX -->
        <div class="donation-section">
            <h3 class="donation-section-title">
                <span class="icon">🇧🇷</span>
                PIX (Instantâneo)
            </h3>
            <div class="pix-info">
                <div class="wallet-card">
                    <div class="wallet-header">
                        <span class="wallet-icon" style="font-size: 2rem;">📱</span>
                        <div>
                            <span class="wallet-name">Chave PIX</span>
                            <span class="wallet-symbol">Transferência Instantânea</span>
                        </div>
                    </div>
                    <div class="wallet-address">${pixKey}</div>
                    <button class="btn-copy" onclick="copyToClipboard('${pixKey}', 'PIX')">
                        <span class="icon">📋</span>
                        Copiar Chave PIX
                    </button>
                </div>
            </div>
        </div>
        
        <!-- CRIPTOMOEDAS -->
        <div class="donation-section">
            <h3 class="donation-section-title">
                <span class="icon">🌐</span>
                Criptomoedas
            </h3>
            <div class="crypto-grid">
    `;
    
    // ✅ GERAR CARDS DAS CRIPTOS COM ÍCONES SVG INLINE
    Object.values(cryptoWallets).forEach(crypto => {
        html += `
            <div class="wallet-card" style="border-left: 3px solid ${crypto.color};">
                <div class="wallet-header">
                    <span class="wallet-icon-svg">${crypto.icon}</span>
                    <div>
                        <span class="wallet-name" style="color: ${crypto.color};">${crypto.name}</span>
                        <span class="wallet-symbol">${crypto.symbol}</span>
                    </div>
                </div>
                <div class="wallet-address" style="font-size: 0.85rem; word-break: break-all;">${crypto.address}</div>
                <button class="btn-copy" onclick="copyToClipboard('${crypto.address}', '${crypto.name}')" style="background: ${crypto.gradient}; color: #000; font-weight: 600;">
                    <span class="icon">📋</span>
                    Copiar Endereço
                </button>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>

        <!-- VALORES SUGERIDOS -->
        <div class="donation-section">
            <h3 class="donation-section-title">
                <span class="icon">💰</span>
                Valores Sugeridos
            </h3>
            <div class="amount-grid">
                <button class="amount-btn" onclick="selectAmount(10)">
                    <span class="amount-value">R$ 10</span>
                    <span class="amount-label">☕ Um Café</span>
                </button>
                <button class="amount-btn" onclick="selectAmount(25)">
                    <span class="amount-value">R$ 25</span>
                    <span class="amount-label">🍕 Uma Pizza</span>
                </button>
                <button class="amount-btn" onclick="selectAmount(50)">
                    <span class="amount-value">R$ 50</span>
                    <span class="amount-label">🚀 Super Apoio</span>
                </button>
                <button class="amount-btn" onclick="selectAmount(100)">
                    <span class="amount-value">R$ 100</span>
                    <span class="amount-label">💎 Premium</span>
                </button>
            </div>
        </div>
    `;
    
    donationMethods.innerHTML = html;
}

// === OPEN PAYMENT LINK ===
function openPaymentLink(method) {
    let url;
    
    if (method === 'mercadopago') {
        url = mercadoPagoLink;
    } else if (method === 'stripe') {
        url = stripeLink;
    }
    
    if (url && url !== 'https://mpago.la/SEU_LINK_AQUI' && url !== 'https://buy.stripe.com/SEU_LINK_AQUI') {
        window.open(url, '_blank');
        trackDonation('Cartão de Crédito');
        showToast('Abrindo checkout seguro...', 'success');
    } else {
        showToast('Configure seu link de pagamento no código!', 'warning');
        console.warn('⚠️ Configure mercadoPagoLink ou stripeLink no donations.js');
    }
}

// === SELECT AMOUNT ===
function selectAmount(amount) {
    showToast(`Valor selecionado: R$ ${amount}`, 'info');
    checkMilestone(amount);
    
    // Aqui você pode abrir o link de pagamento com o valor pré-selecionado
    // Exemplo: openPaymentLink('mercadopago') com parâmetro de valor
}

// === COPY TO CLIPBOARD ===
function copyToClipboard(text, method) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${method} copiado!`, 'success');
        trackDonation(method);
    }).catch(err => {
        showToast('Erro ao copiar', 'error');
        console.error('Copy error:', err);
    });
}

// === DONATION ANIMATIONS ===
document.addEventListener('DOMContentLoaded', () => {
    const donateBtn = document.getElementById('donateBtn');
    if (donateBtn) {
        donateBtn.addEventListener('mouseenter', () => {
            donateBtn.style.animation = 'pulse 0.5s ease';
        });
        
        donateBtn.addEventListener('animationend', () => {
            donateBtn.style.animation = '';
        });
    }
});

// === DONATION ANALYTICS ===
function trackDonation(method) {
    console.log(`💎 Donation method clicked: ${method}`);
}

// === SHARE DONATION LINK ===
function shareDonationLink() {
    const url = window.location.href;
    const text = 'Confira o TaskMonitor 3.0 - Sistema de Monitoramento Cyberpunk!';
    
    if (navigator.share) {
        navigator.share({
            title: 'TaskMonitor 3.0',
            text: text,
            url: url
        }).then(() => {
            showToast('Link compartilhado!', 'success');
        }).catch(err => {
            console.log('Share cancelled:', err);
        });
    } else {
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link copiado para área de transferência!', 'success');
        });
    }
}

// === EASTER EGG - KONAMI CODE ===
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    
    if (konamiCode.length > 10) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    showToast('🎉 Código Konami Ativado! Modo Matrix!', 'success');
    
    const body = document.body;
    body.style.animation = 'glitch 0.3s ease 5';
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.3';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    let frameCount = 0;
    const maxFrames = 200;
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00f0ff';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        
        frameCount++;
        if (frameCount < maxFrames) {
            requestAnimationFrame(drawMatrix);
        } else {
            document.body.removeChild(canvas);
        }
    }
    
    drawMatrix();
}

// === DONATION MILESTONES ===
const donationMilestones = [
    { amount: 10, message: 'Obrigado por apoiar o projeto! ☕' },
    { amount: 25, message: 'Você é incrível! 🍕' },
    { amount: 50, message: 'Sua contribuição faz diferença! 🚀' },
    { amount: 100, message: 'WOW! Você é um super apoiador! 💎' },
    { amount: 500, message: 'LENDÁRIO! Seu nome entra no hall da fama! 🏆' }
];

function checkMilestone(amount) {
    const milestone = donationMilestones
        .reverse()
        .find(m => amount >= m.amount);
    
    if (milestone) {
        showToast(milestone.message, 'success');
    }
}

console.log('💎 Donations module loaded - Crypto icons ready!');
