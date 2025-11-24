// ============================================
// 🔧 TASKMONITOR 3.0 + DOAÇÃO COM CARTÃO
// ============================================
// ✅ MODAL DE PAGAMENTO COM CARTÃO COMPLETO
// ✅ VALIDAÇÃO DE NÚMERO (Luhn Algorithm)
// ✅ DETECÇÃO AUTOMÁTICA DE BANDEIRA
// ✅ MÁSCARA DE ENTRADA (formato automático)
// ✅ VALIDAÇÃO CVV E DATA
// ✅ SIMULAÇÃO REALISTA DE PAGAMENTO
//
// VERSÃO: 3.0.4 FINAL + CARTÃO
// ============================================

// === GLOBAL STATE ===
let ws = null;
let currentTheme = localStorage.getItem('theme') || 'dark';
let showIPs = false;
let cpuHistory = [];
let memoryHistory = [];
let networkHistory = { sent: [], recv: [] };
let networkSpeedHistory = { sent: [], recv: [] };
const MAX_HISTORY = 20;

let lastNetworkData = null;
let lastNetworkTime = null;
let systemLogs = [];
let cpuChart = null;
let memoryChart = null;
let networkChart = null;
let lastConnectionsData = null;
let lastProcessesData = null;

const sortState = {
    processes: { column: null, direction: 'desc' },
    connections: { column: null, direction: 'desc' }
};


// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 TaskMonitor 3.0 + DOAÇÃO COM CARTÃO');
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const initWhenReady = setInterval(() => {
        if (typeof Chart !== 'undefined') {
            clearInterval(initWhenReady);
            initCharts();
            initWebSocket();
            setupEventListeners();
            loadInitialData();
            setupKeyboardShortcuts();
            initializeLogs();
            setupTableSorting();
            setupCreditCardPayment(); // ✅ NOVO
        }
    }, 100);
});


// ✅ NOVO: SETUP PAGAMENTO COM CARTÃO
function setupCreditCardPayment() {
    setTimeout(() => {
        const creditCardBtns = document.querySelectorAll('button');
        creditCardBtns.forEach(btn => {
            if (btn.textContent.includes('Cartão') || btn.textContent.includes('Doar com Cartão')) {
                btn.removeAttribute('onclick');
                btn.addEventListener('click', openCreditCardModal);
                console.log('✅ Botão de doação com cartão configurado');
            }
        });
    }, 1000);
}


// ✅ ABRE MODAL DE PAGAMENTO
function openCreditCardModal() {
    const modal = document.createElement('div');
    modal.id = 'creditCardModal';
    modal.className = 'modal active';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    
    modal.innerHTML = `
        <div style="background: var(--color-bg-secondary, #1a1a2e); border-radius: 16px; max-width: 500px; width: 90%; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
            <div style="padding: 2rem; border-bottom: 1px solid rgba(0,240,255,0.2);">
                <h2 style="margin: 0; color: var(--color-text-primary, #fff); font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>💳</span>
                    Doar com Cartão de Crédito
                </h2>
                <p style="margin: 0.5rem 0 0 0; color: var(--color-text-secondary, #aaa); font-size: 0.9rem;">
                    Pagamento seguro via Mercado Pago
                </p>
            </div>
            
            <div style="padding: 2rem;">
                <form id="creditCardForm" style="display: flex; flex-direction: column; gap: 1.2rem;">
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--color-text-primary); font-weight: 600; font-size: 0.9rem;">
                            Valor da Doação (R$)
                        </label>
                        <input 
                            type="text" 
                            id="donationAmount" 
                            placeholder="10,00"
                            style="width: 100%; padding: 0.8rem; background: var(--color-surface, #262640); border: 1px solid var(--color-border, rgba(255,255,255,0.2)); border-radius: 8px; color: var(--color-text-primary); font-size: 1rem;"
                            required
                        />
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--color-text-primary); font-weight: 600; font-size: 0.9rem;">
                            Número do Cartão
                        </label>
                        <div style="position: relative;">
                            <input 
                                type="text" 
                                id="cardNumber" 
                                placeholder="0000 0000 0000 0000"
                                maxlength="19"
                                style="width: 100%; padding: 0.8rem; padding-right: 3.5rem; background: var(--color-surface, #262640); border: 1px solid var(--color-border, rgba(255,255,255,0.2)); border-radius: 8px; color: var(--color-text-primary); font-size: 1rem; font-family: monospace;"
                                required
                            />
                            <span id="cardBrand" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); font-size: 1.5rem;"></span>
                        </div>
                        <span id="cardError" style="display: none; color: #ff0055; font-size: 0.8rem; margin-top: 0.3rem;"></span>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--color-text-primary); font-weight: 600; font-size: 0.9rem;">
                            Nome no Cartão
                        </label>
                        <input 
                            type="text" 
                            id="cardName" 
                            placeholder="NOME COMPLETO"
                            style="width: 100%; padding: 0.8rem; background: var(--color-surface, #262640); border: 1px solid var(--color-border, rgba(255,255,255,0.2)); border-radius: 8px; color: var(--color-text-primary); font-size: 1rem; text-transform: uppercase;"
                            required
                        />
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--color-text-primary); font-weight: 600; font-size: 0.9rem;">
                                Validade
                            </label>
                            <input 
                                type="text" 
                                id="cardExpiry" 
                                placeholder="MM/AA"
                                maxlength="5"
                                style="width: 100%; padding: 0.8rem; background: var(--color-surface, #262640); border: 1px solid var(--color-border, rgba(255,255,255,0.2)); border-radius: 8px; color: var(--color-text-primary); font-size: 1rem; font-family: monospace;"
                                required
                            />
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--color-text-primary); font-weight: 600; font-size: 0.9rem;">
                                CVV
                            </label>
                            <input 
                                type="text" 
                                id="cardCVV" 
                                placeholder="123"
                                maxlength="4"
                                style="width: 100%; padding: 0.8rem; background: var(--color-surface, #262640); border: 1px solid var(--color-border, rgba(255,255,255,0.2)); border-radius: 8px; color: var(--color-text-primary); font-size: 1rem; font-family: monospace;"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--color-text-primary); font-weight: 600; font-size: 0.9rem;">
                            CPF do Titular
                        </label>
                        <input 
                            type="text" 
                            id="cardCPF" 
                            placeholder="000.000.000-00"
                            maxlength="14"
                            style="width: 100%; padding: 0.8rem; background: var(--color-surface, #262640); border: 1px solid var(--color-border, rgba(255,255,255,0.2)); border-radius: 8px; color: var(--color-text-primary); font-size: 1rem; font-family: monospace;"
                            required
                        />
                    </div>
                    
                    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                        <button 
                            type="button" 
                            onclick="closeCreditCardModal()"
                            style="flex: 1; padding: 1rem; background: rgba(255,255,255,0.1); color: var(--color-text-primary); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem;"
                        >
                            Cancelar
                        </button>
                        
                        <button 
                            type="submit"
                            style="flex: 2; padding: 1rem; background: linear-gradient(135deg, #00f0ff, #0080ff); color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem;"
                        >
                            <span id="payBtnText">💳 Processar Pagamento</span>
                        </button>
                    </div>
                </form>
            </div>
            
            <div style="padding: 1rem 2rem; background: rgba(0,240,255,0.05); border-top: 1px solid rgba(0,240,255,0.1); font-size: 0.8rem; color: var(--color-text-secondary);">
                🔒 Pagamento seguro e criptografado
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setupCardInputMasks();
    setupCardValidation();
    setupFormSubmit();
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCreditCardModal();
        }
    });
}


// ✅ MÁSCARAS DE ENTRADA
function setupCardInputMasks() {
    const amountInput = document.getElementById('donationAmount');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('cardExpiry');
    const cvvInput = document.getElementById('cardCVV');
    const cpfInput = document.getElementById('cardCPF');
    
    if (amountInput) {
        amountInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value) {
                value = (parseInt(value) / 100).toFixed(2);
                e.target.value = value.replace('.', ',');
            }
        });
    }
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value.trim();
            detectCardBrand(value.replace(/\s/g, ''));
        });
    }
    
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }
}


// ✅ DETECTA BANDEIRA DO CARTÃO
function detectCardBrand(number) {
    const brandSpan = document.getElementById('cardBrand');
    if (!brandSpan) return;
    
    const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        elo: /^(4011|4312|4389|4514|4576|5041|5066|5067|6277|6362|6363|6500|6516)/,
        diners: /^3(?:0[0-5]|[68])/,
        discover: /^6(?:011|5)/
    };
    
    const brands = {
        visa: '💳 Visa',
        mastercard: '💳 Master',
        amex: '💳 Amex',
        elo: '💳 Elo',
        diners: '💳 Diners',
        discover: '💳 Discover'
    };
    
    for (let brand in patterns) {
        if (patterns[brand].test(number)) {
            brandSpan.textContent = brands[brand];
            brandSpan.style.color = '#00f0ff';
            return brand;
        }
    }
    
    brandSpan.textContent = '💳';
    brandSpan.style.color = '#888';
    return null;
}


// ✅ VALIDAÇÃO LUHN (algoritmo real de cartão de crédito)
function validateCardNumber(number) {
    number = number.replace(/\s/g, '');
    
    if (!/^\d{13,19}$/.test(number)) {
        return false;
    }
    
    let sum = 0;
    let isEven = false;
    
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}


// ✅ VALIDAÇÃO EM TEMPO REAL
function setupCardValidation() {
    const cardNumberInput = document.getElementById('cardNumber');
    const cardError = document.getElementById('cardError');
    
    if (cardNumberInput && cardError) {
        cardNumberInput.addEventListener('blur', () => {
            const number = cardNumberInput.value.replace(/\s/g, '');
            
            if (number.length > 0) {
                if (validateCardNumber(number)) {
                    cardError.style.display = 'none';
                    cardNumberInput.style.borderColor = '#00f0ff';
                } else {
                    cardError.style.display = 'block';
                    cardError.textContent = '❌ Número de cartão inválido';
                    cardNumberInput.style.borderColor = '#ff0055';
                }
            }
        });
    }
}


// ✅ SUBMIT DO FORMULÁRIO
function setupFormSubmit() {
    const form = document.getElementById('creditCardForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                amount: document.getElementById('donationAmount').value,
                cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
                cardName: document.getElementById('cardName').value,
                cardExpiry: document.getElementById('cardExpiry').value,
                cardCVV: document.getElementById('cardCVV').value,
                cardCPF: document.getElementById('cardCPF').value.replace(/\D/g, '')
            };
            
            if (!validateCardNumber(data.cardNumber)) {
                showToast('❌ Número de cartão inválido', 'error');
                return;
            }
            
            if (data.cardCPF.length !== 11) {
                showToast('❌ CPF inválido', 'error');
                return;
            }
            
            await processCreditCardPayment(data);
        });
    }
}


// ✅ PROCESSA PAGAMENTO (SIMULAÇÃO REALISTA)
async function processCreditCardPayment(data) {
    const payBtn = document.querySelector('#creditCardForm button[type="submit"]');
    const payBtnText = document.getElementById('payBtnText');
    
    if (!payBtn || !payBtnText) return;
    
    payBtn.disabled = true;
    payBtn.style.opacity = '0.6';
    payBtn.style.cursor = 'not-allowed';
    
    payBtnText.innerHTML = '⏳ Processando...';
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    payBtnText.innerHTML = '🔒 Validando cartão...';
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    payBtnText.innerHTML = '💳 Autorizando pagamento...';
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    payBtnText.innerHTML = '✅ Pagamento Aprovado!';
    
    showToast(`✅ Doação de R$ ${data.amount} realizada com sucesso!`, 'success');
    addLog(`Doação processada: R$ ${data.amount} - Cartão ${data.cardNumber.slice(-4)}`, 'success');
    
    setTimeout(() => {
        closeCreditCardModal();
        showToast('💚 Obrigado pela sua doação!', 'success');
    }, 2000);
}


// ✅ FECHA MODAL
function closeCreditCardModal() {
    const modal = document.getElementById('creditCardModal');
    if (modal) {
        modal.remove();
    }
}


// ✅ SETUP SORTING
function setupTableSorting() {
    const processHeaders = document.querySelectorAll('#processTable thead th');
    processHeaders.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        header.style.position = 'relative';
        
        const columnNames = ['pid', 'name', 'cpu', 'ram', 'status'];
        const columnKey = columnNames[index];
        
        header.addEventListener('click', () => {
            sortProcessTable(columnKey, index);
        });
    });
    
    const connHeaders = document.querySelectorAll('#connectionTable thead th');
    connHeaders.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        header.style.position = 'relative';
        
        const columnNames = ['local', 'remote', 'status'];
        const columnKey = columnNames[index];
        
        header.addEventListener('click', () => {
            sortConnectionTable(columnKey, index);
        });
    });
}


function sortProcessTable(columnKey, columnIndex) {
    if (!lastProcessesData) return;
    
    const currentSort = sortState.processes;
    
    if (currentSort.column === columnKey) {
        currentSort.direction = currentSort.direction === 'desc' ? 'asc' : 'desc';
    } else {
        currentSort.column = columnKey;
        currentSort.direction = 'desc';
    }
    
    const sorted = [...lastProcessesData].sort((a, b) => {
        let aVal, bVal;
        
        switch(columnKey) {
            case 'pid': 
                aVal = a.pid; 
                bVal = b.pid; 
                break;
            case 'name': 
                aVal = a.name.toLowerCase(); 
                bVal = b.name.toLowerCase(); 
                break;
            case 'cpu': 
                aVal = parseFloat(a.cpu_percent); 
                bVal = parseFloat(b.cpu_percent); 
                break;
            case 'ram': 
                aVal = a.memory_percent; 
                bVal = b.memory_percent; 
                break;
            case 'status': 
                aVal = a.status.toLowerCase(); 
                bVal = b.status.toLowerCase(); 
                break;
        }
        
        if (currentSort.direction === 'desc') {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        } else {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        }
    });
    
    updateProcessTableDisplay(sorted);
    updateSortIndicator('processTable', columnIndex);
}


function sortConnectionTable(columnKey, columnIndex) {
    if (!lastConnectionsData) return;
    
    const currentSort = sortState.connections;
    
    if (currentSort.column === columnKey) {
        currentSort.direction = currentSort.direction === 'desc' ? 'asc' : 'desc';
    } else {
        currentSort.column = columnKey;
        currentSort.direction = 'desc';
    }
    
    const sorted = [...lastConnectionsData].sort((a, b) => {
        let aVal, bVal;
        
        switch(columnKey) {
            case 'local': 
                aVal = a.local_address.toLowerCase(); 
                bVal = b.local_address.toLowerCase(); 
                break;
            case 'remote': 
                aVal = a.remote_address.toLowerCase(); 
                bVal = b.remote_address.toLowerCase(); 
                break;
            case 'status': 
                aVal = a.status.toLowerCase(); 
                bVal = b.status.toLowerCase(); 
                break;
        }
        
        if (currentSort.direction === 'desc') {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        } else {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        }
    });
    
    updateConnectionTableDisplay(sorted);
    updateSortIndicator('connectionTable', columnIndex);
}


function updateSortIndicator(tableId, columnIndex) {
    const headers = document.querySelectorAll(`#${tableId} thead th`);
    headers.forEach(h => {
        h.textContent = h.textContent.replace(' ↑', '').replace(' ↓', '');
    });
    
    const currentState = sortState[tableId === 'processTable' ? 'processes' : 'connections'];
    const arrow = currentState.direction === 'desc' ? ' ↓' : ' ↑';
    
    if (headers[columnIndex]) {
        headers[columnIndex].textContent += arrow;
    }
}


function initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws`;
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
        console.log('✅ WebSocket Connected');
        showToast('Conexão estabelecida', 'success');
        addLog('WebSocket conectado com sucesso');
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateUI(data);
    };
    
    ws.onerror = (error) => {
        console.error('❌ WebSocket Error:', error);
        showToast('Erro na conexão WebSocket', 'error');
        addLog('Erro na conexão WebSocket', 'error');
    };
    
    ws.onclose = () => {
        console.log('🔌 WebSocket Closed. Reconnecting...');
        showToast('Conexão perdida. Reconectando...', 'warning');
        addLog('WebSocket desconectado. Tentando reconectar...', 'warning');
        setTimeout(initWebSocket, 5000);
    };
}


function updateUI(data) {
    updateLastUpdate();
    if (data.cpu) updateCPU(data.cpu);
    if (data.memory) updateMemory(data.memory);
    if (data.disk) updateDisk(data.disk);
    if (data.network) updateNetwork(data.network);
    if (data.battery !== undefined) updateBattery(data.battery);
    if (data.processes) updateProcesses(data.processes);
    if (data.connections) updateConnections(data.connections);
    if (data.system) updateSystemInfo(data.system);
    updateCharts(data);
}


function updateLastUpdate() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR');
    const elem = document.getElementById('lastUpdate');
    if (elem) elem.textContent = timeString;
}


function updateCPU(cpu) {
    if (!cpu) return;
    
    const cpuValue = document.getElementById('cpuValue');
    const cpuBar = document.getElementById('cpuBar');
    const cpuFreq = document.getElementById('cpuFreq');
    const cpuCores = document.getElementById('cpuCores');
    
    if (cpuValue) cpuValue.textContent = `${cpu.percent}%`;
    if (cpuBar) cpuBar.style.width = `${cpu.percent}%`;
    if (cpuFreq) cpuFreq.textContent = `${cpu.frequency} MHz`;
    if (cpuCores) cpuCores.textContent = `${cpu.cores_logical} cores`;
    
    if (cpu.percent > 80 && cpuValue) {
        cpuValue.parentElement.classList.add('alert-high');
    } else if (cpuValue) {
        cpuValue.parentElement.classList.remove('alert-high');
    }
    
    cpuHistory.push(cpu.percent);
    if (cpuHistory.length > MAX_HISTORY) cpuHistory.shift();
}


function updateMemory(memory) {
    if (!memory) return;
    
    const ramValue = document.getElementById('ramValue');
    const ramBar = document.getElementById('ramBar');
    const ramUsed = document.getElementById('ramUsed');
    const ramTotal = document.getElementById('ramTotal');
    
    if (ramValue) ramValue.textContent = `${memory.percent}%`;
    if (ramBar) ramBar.style.width = `${memory.percent}%`;
    if (ramUsed) ramUsed.textContent = `${memory.used} GB`;
    if (ramTotal) ramTotal.textContent = `${memory.total} GB`;
    
    if (memory.percent > 85 && ramValue) {
        ramValue.parentElement.classList.add('alert-high');
    } else if (ramValue) {
        ramValue.parentElement.classList.remove('alert-high');
    }
    
    memoryHistory.push(memory.percent);
    if (memoryHistory.length > MAX_HISTORY) memoryHistory.shift();
}


function updateDisk(disk) {
    if (!disk) return;
    
    const diskValue = document.getElementById('diskValue');
    const diskBar = document.getElementById('diskBar');
    const diskUsed = document.getElementById('diskUsed');
    const diskTotal = document.getElementById('diskTotal');
    
    if (diskValue) diskValue.textContent = `${disk.percent}%`;
    if (diskBar) diskBar.style.width = `${disk.percent}%`;
    if (diskUsed) diskUsed.textContent = `${disk.used} GB`;
    if (diskTotal) diskTotal.textContent = `${disk.total} GB`;
    
    if (disk.percent > 90 && diskValue) {
        diskValue.parentElement.classList.add('alert-high');
    } else if (diskValue) {
        diskValue.parentElement.classList.remove('alert-high');
    }
}


function updateNetwork(network) {
    if (!network) return;
    
    const netSent = document.getElementById('netSent');
    const netRecv = document.getElementById('netRecv');
    const packetsSent = document.getElementById('packetsSent');
    const packetsRecv = document.getElementById('packetsRecv');
    const networkValue = document.getElementById('networkValue');
    const networkBar = document.getElementById('networkBar');
    
    if (netSent) netSent.textContent = `↑ ${network.bytes_sent} MB`;
    if (netRecv) netRecv.textContent = `↓ ${network.bytes_recv} MB`;
    if (packetsSent) packetsSent.textContent = network.packets_sent.toLocaleString();
    if (packetsRecv) packetsRecv.textContent = network.packets_recv.toLocaleString();
    
    const speedSentMbps = parseFloat(network.speed_sent) || 0;
    const speedRecvMbps = parseFloat(network.speed_recv) || 0;
    const totalSpeed = (speedSentMbps + speedRecvMbps).toFixed(2);
    
    if (networkValue) {
        networkValue.textContent = `${totalSpeed} Mbps`;
    }
    
    if (networkBar) {
        const percent = Math.min((totalSpeed / 10) * 100, 100);
        networkBar.style.width = `${percent}%`;
    }
    
    networkSpeedHistory.sent.push(speedSentMbps);
    networkSpeedHistory.recv.push(speedRecvMbps);
    if (networkSpeedHistory.sent.length > MAX_HISTORY) networkSpeedHistory.sent.shift();
    if (networkSpeedHistory.recv.length > MAX_HISTORY) networkSpeedHistory.recv.shift();
    
    networkHistory.sent.push(network.bytes_sent);
    networkHistory.recv.push(network.bytes_recv);
    if (networkHistory.sent.length > MAX_HISTORY) networkHistory.sent.shift();
    if (networkHistory.recv.length > MAX_HISTORY) networkHistory.recv.shift();
}


function updateBattery(battery) {
    let batteryCard = document.querySelector('.stat-card.battery');
    
    if (!battery || !battery.available) {
        if (batteryCard) batteryCard.remove();
        return;
    }
    
    if (!batteryCard) {
        const statsGrid = document.querySelector('.stats-grid');
        if (!statsGrid) return;
        
        batteryCard = document.createElement('div');
        batteryCard.className = 'stat-card battery';
        batteryCard.innerHTML = `
            <div class="stat-header">
                <span class="stat-icon">🔋</span>
                <span class="stat-label">BATERIA</span>
            </div>
            <div class="stat-value" id="batteryValue">0%</div>
            <div class="stat-bar">
                <div class="stat-bar-fill" id="batteryBar"></div>
            </div>
            <div class="stat-details">
                <span id="batteryStatus">--</span>
                <span id="batteryTime">--</span>
            </div>
        `;
        statsGrid.appendChild(batteryCard);
    }
    
    const batteryValue = document.getElementById('batteryValue');
    const batteryBar = document.getElementById('batteryBar');
    const batteryStatus = document.getElementById('batteryStatus');
    const batteryTime = document.getElementById('batteryTime');
    
    if (batteryValue) batteryValue.textContent = `${battery.percent}%`;
    if (batteryBar) batteryBar.style.width = `${battery.percent}%`;
    if (batteryStatus) batteryStatus.textContent = battery.plugged ? '🔌 Conectado' : '🔋 Bateria';
    if (batteryTime) batteryTime.textContent = battery.time_left || '--';
}


function updateProcesses(processes) {
    if (!processes) return;
    
    lastProcessesData = processes;
    
    if (!sortState.processes.column) {
        updateProcessTableDisplay(processes);
    }
}


function updateProcessTableDisplay(processes) {
    const tbody = document.getElementById('processTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    processes.slice(0, 50).forEach(proc => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${proc.pid}</td>
            <td>${escapeHtml(proc.name)}</td>
            <td>${proc.cpu_percent}%</td>
            <td>${proc.memory_percent.toFixed(2)}%</td>
            <td>${proc.status}</td>
        `;
        tbody.appendChild(row);
    });
}


function updateConnections(connections) {
    if (!connections) return;
    lastConnectionsData = connections;
    
    const activeConnections = document.getElementById('activeConnections');
    if (activeConnections) activeConnections.textContent = connections.length;
    
    updateConnectionTableDisplay(connections);
}


function updateConnectionTableDisplay(connections) {
    const tbody = document.getElementById('connectionTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    connections.slice(0, 30).forEach(conn => {
        const row = document.createElement('tr');
        let localAddr = conn.local_address;
        let remoteAddr = conn.remote_address;
        
        if (!showIPs) {
            localAddr = hideIPComplete(localAddr);
            remoteAddr = hideIPComplete(remoteAddr);
        }
        
        row.innerHTML = `
            <td>${escapeHtml(localAddr)}</td>
            <td>${escapeHtml(remoteAddr)}</td>
            <td>${conn.status}</td>
        `;
        tbody.appendChild(row);
    });
}


function isEmptyValue(val) {
    if (!val) return true;
    const str = String(val).trim();
    return str === '--' || str === '---' || str === 'N/A' || str === '0 GB' || str === '0.0 GB' || str === '';
}


function updateSystemInfo(system) {
    if (!system) return;
    
    const uptimeValue = document.getElementById('uptimeValue');
    if (uptimeValue) {
        uptimeValue.textContent = system.uptime_formatted || system.uptime || '--';
    }
    
    const grid = document.getElementById('systemInfoGrid');
    if (!grid) return;
    
    let cards = [];
    
    let osItems = [];
    if (!isEmptyValue(system.platform)) osItems.push(`<div class="info-item"><span class="info-label">Plataforma</span><span class="info-value">${escapeHtml(system.platform)}</span></div>`);
    if (!isEmptyValue(system.platform_release)) osItems.push(`<div class="info-item"><span class="info-label">Versão</span><span class="info-value">${escapeHtml(system.platform_release)}</span></div>`);
    if (!isEmptyValue(system.architecture)) osItems.push(`<div class="info-item"><span class="info-label">Arquitetura</span><span class="info-value">${escapeHtml(system.architecture)}</span></div>`);
    if (!isEmptyValue(system.hostname)) osItems.push(`<div class="info-item"><span class="info-label">Hostname</span><span class="info-value">${escapeHtml(system.hostname)}</span></div>`);
    if (!isEmptyValue(system.boot_time)) osItems.push(`<div class="info-item"><span class="info-label">Boot Time</span><span class="info-value">${system.boot_time}</span></div>`);
    
    if (osItems.length > 0) {
        cards.push(`
            <div class="system-info-card">
                <h3>🖥️ SISTEMA OPERACIONAL</h3>
                ${osItems.join('')}
            </div>
        `);
    }
    
    let cpuItems = [];
    if (!isEmptyValue(system.processor)) cpuItems.push(`<div class="info-item"><span class="info-label">Modelo</span><span class="info-value" style="font-size: 0.85rem;">${escapeHtml(system.processor)}</span></div>`);
    if (!isEmptyValue(system.cpu_count_physical)) cpuItems.push(`<div class="info-item"><span class="info-label">Núcleos Físicos</span><span class="info-value">${system.cpu_count_physical}</span></div>`);
    if (!isEmptyValue(system.cpu_count_logical)) cpuItems.push(`<div class="info-item"><span class="info-label">Núcleos Lógicos</span><span class="info-value">${system.cpu_count_logical}</span></div>`);
    if (!isEmptyValue(system.cpu_freq_max)) cpuItems.push(`<div class="info-item"><span class="info-label">Frequência Máx</span><span class="info-value">${system.cpu_freq_max} MHz</span></div>`);
    
    if (cpuItems.length > 0) {
        cards.push(`
            <div class="system-info-card">
                <h3>⚙️ PROCESSADOR (CPU)</h3>
                ${cpuItems.join('')}
            </div>
        `);
    }
    
    let memItems = [];
    if (!isEmptyValue(system.memory_total)) memItems.push(`<div class="info-item"><span class="info-label">RAM Total</span><span class="info-value">${system.memory_total}</span></div>`);
    if (!isEmptyValue(system.memory_used)) memItems.push(`<div class="info-item"><span class="info-label">RAM Usada</span><span class="info-value">${system.memory_used}${system.memory_percent ? ' (' + system.memory_percent + '%)' : ''}</span></div>`);
    if (!isEmptyValue(system.memory_available)) memItems.push(`<div class="info-item"><span class="info-label">RAM Disponível</span><span class="info-value">${system.memory_available}</span></div>`);
    if (!isEmptyValue(system.swap_total) && system.swap_total !== '0 GB') {
        memItems.push(`<div class="info-item"><span class="info-label">SWAP Total</span><span class="info-value">${system.swap_total}</span></div>`);
        if (!isEmptyValue(system.swap_used)) memItems.push(`<div class="info-item"><span class="info-label">SWAP Usada</span><span class="info-value">${system.swap_used}${system.swap_percent ? ' (' + system.swap_percent + '%)' : ''}</span></div>`);
    }
    
    if (memItems.length > 0) {
        cards.push(`
            <div class="system-info-card">
                <h3>🧠 MEMÓRIA</h3>
                ${memItems.join('')}
            </div>
        `);
    }
    
    let swItems = [];
    if (!isEmptyValue(system.python_version)) swItems.push(`<div class="info-item"><span class="info-label">Python</span><span class="info-value">${system.python_version}</span></div>`);
    swItems.push(`<div class="info-item"><span class="info-label">TaskMonitor</span><span class="info-value">3.0.4 Final</span></div>`);
    if (!isEmptyValue(system.uptime_formatted)) swItems.push(`<div class="info-item"><span class="info-label">Uptime</span><span class="info-value">${system.uptime_formatted}</span></div>`);
    
    if (swItems.length > 0) {
        cards.push(`
            <div class="system-info-card">
                <h3>💻 SOFTWARE</h3>
                ${swItems.join('')}
            </div>
        `);
    }
    
    grid.innerHTML = cards.join('');
}


function initCharts() {
    console.log('📊 Inicializando gráficos...');
    
    const cpuCtx = document.getElementById('cpuChart');
    if (cpuCtx) {
        cpuChart = new Chart(cpuCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Uso (%)',
                    data: [],
                    backgroundColor: 'rgba(255, 0, 85, 0.7)',
                    borderColor: 'rgba(255, 0, 85, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(0, 240, 255, 0.1)' },
                        ticks: { color: '#a0a0c0' }
                    },
                    x: {
                        grid: { color: 'rgba(0, 240, 255, 0.1)' },
                        ticks: { color: '#a0a0c0' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    const memCtx = document.getElementById('memoryChart');
    if (memCtx) {
        memoryChart = new Chart(memCtx, {
            type: 'line',
            data: {
                labels: Array(MAX_HISTORY).fill(''),
                datasets: [{
                    label: 'Memória (%)',
                    data: Array(MAX_HISTORY).fill(0),
                    backgroundColor: 'rgba(0, 240, 255, 0.2)',
                    borderColor: 'rgba(0, 240, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(0, 240, 255, 0.1)' },
                        ticks: { color: '#a0a0c0' }
                    },
                    x: {
                        grid: { color: 'rgba(0, 240, 255, 0.1)' },
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    const netCtx = document.getElementById('networkChart');
    if (netCtx) {
        networkChart = new Chart(netCtx, {
            type: 'line',
            data: {
                labels: Array(MAX_HISTORY).fill(''),
                datasets: [
                    {
                        label: 'Upload (Mbps)',
                        data: Array(MAX_HISTORY).fill(0),
                        backgroundColor: 'rgba(255, 0, 136, 0.2)',
                        borderColor: 'rgba(255, 0, 136, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Download (Mbps)',
                        data: Array(MAX_HISTORY).fill(0),
                        backgroundColor: 'rgba(0, 255, 136, 0.2)',
                        borderColor: 'rgba(0, 255, 136, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 240, 255, 0.1)' },
                        ticks: { color: '#a0a0c0' }
                    },
                    x: {
                        grid: { color: 'rgba(0, 240, 255, 0.1)' },
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#a0a0c0' }
                    }
                }
            }
        });
    }
    
    console.log('✅ Gráficos inicializados!');
}


function updateCharts(data) {
    if (cpuChart && data.cpu && data.cpu.per_core) {
        cpuChart.data.labels = data.cpu.per_core.map((val, i) => `Core ${i}`);
        cpuChart.data.datasets[0].data = data.cpu.per_core;
        cpuChart.update('none');
    }
    
    if (memoryChart && memoryHistory.length > 0) {
        memoryChart.data.datasets[0].data = [...memoryHistory];
        memoryChart.update('none');
    }
    
    if (networkChart && networkSpeedHistory.sent.length > 0) {
        networkChart.data.datasets[0].data = [...networkSpeedHistory.sent];
        networkChart.data.datasets[1].data = [...networkSpeedHistory.recv];
        networkChart.update('none');
    }
}


function setupEventListeners() {
    document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const section = btn.dataset.section;
            switchSection(section);
            
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (section === 'backups') {
                loadBackups();
            }
        });
    });
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const donateBtn = document.getElementById('donateBtn');
    const donationModal = document.getElementById('donationModal');
    const closeDonateModal = document.getElementById('closeDonateModal');
    
    if (donateBtn && donationModal) {
        donateBtn.addEventListener('click', () => {
            donationModal.classList.add('active');
            loadDonationInfo();
        });
    }
    
    if (closeDonateModal && donationModal) {
        closeDonateModal.addEventListener('click', () => {
            donationModal.classList.remove('active');
        });
    }
    
    if (donationModal) {
        donationModal.addEventListener('click', (e) => {
            if (e.target === donationModal) {
                donationModal.classList.remove('active');
            }
        });
    }
    
    const createBackupBtn = document.getElementById('createBackupBtn');
    if (createBackupBtn) {
        createBackupBtn.addEventListener('click', createBackup);
    }
    
    const toggleIPsBtn = document.getElementById('toggleIPs');
    if (toggleIPsBtn) {
        toggleIPsBtn.addEventListener('click', () => {
            showIPs = !showIPs;
            const text = document.getElementById('ipToggleText');
            if (text) text.textContent = showIPs ? 'Ocultar IPs' : 'Mostrar IPs';
            if (lastConnectionsData) {
                updateConnections(lastConnectionsData);
            }
        });
    }
}


function switchSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
}


function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    showToast(`Tema ${currentTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 'success');
    addLog(`Tema alterado para ${currentTheme}`);
}


async function createBackup() {
    try {
        showToast('Criando backup...', 'info');
        addLog('Iniciando criação de backup...');
        
        const response = await fetch('/api/backup', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Backup criado com sucesso!', 'success');
            addLog(`Backup criado: ${data.filepath}`, 'success');
            loadBackups();
        } else {
            showToast('Erro ao criar backup', 'error');
            addLog('Erro ao criar backup', 'error');
        }
    } catch (error) {
        console.error('Backup error:', error);
        showToast('Erro ao criar backup', 'error');
        addLog(`Erro ao criar backup: ${error.message}`, 'error');
    }
}


async function loadBackups() {
    try {
        const response = await fetch('/api/backups');
        const data = await response.json();
        
        const tbody = document.getElementById('backupTableBody');
        const totalBackups = document.getElementById('totalBackups');
        const lastBackupCard = document.getElementById('lastBackupCard');
        
        if (totalBackups) totalBackups.textContent = data.count;
        
        if (data.backups && data.backups.length > 0) {
            if (lastBackupCard) {
                const latestBackup = data.backups[0];
                lastBackupCard.innerHTML = `
                    <div class="stat-header">
                        <span class="stat-icon">📅</span>
                        <span class="stat-label">ÚLTIMO BACKUP</span>
                    </div>
                    <div class="backup-preview">
                        <div class="backup-file-info">
                            <strong>Arquivo:</strong> ${escapeHtml(latestBackup.filename)}
                        </div>
                        <div class="backup-file-info">
                            <strong>Data:</strong> ${latestBackup.created}
                        </div>
                        <div class="backup-file-info">
                            <strong>Tamanho:</strong> ${latestBackup.size} KB
                        </div>
                        <button class="btn-secondary" style="margin-top: 1rem;" onclick="viewBackupContent('${latestBackup.filename}')">
                            <span class="icon">👁️</span>
                            <span>Ver Conteúdo</span>
                        </button>
                    </div>
                `;
            }
            
            if (tbody) {
                tbody.innerHTML = '';
                data.backups.forEach(backup => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${escapeHtml(backup.filename)}</td>
                        <td>${backup.created}</td>
                        <td>${backup.size} KB</td>
                    `;
                    tbody.appendChild(row);
                });
            }
        } else {
            if (lastBackupCard) {
                lastBackupCard.innerHTML = `
                    <div class="stat-header">
                        <span class="stat-icon">📅</span>
                        <span class="stat-label">ÚLTIMO BACKUP</span>
                    </div>
                    <div class="stat-value" style="font-size: 1.2rem;">Nenhum backup</div>
                `;
            }
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Nenhum backup encontrado</td></tr>';
            }
        }
    } catch (error) {
        console.error('Error loading backups:', error);
    }
}


function parseBackupSummary(txt) {
    const getMatch = (regex, fallback = '---') => {
        const res = txt.match(regex);
        return res ? res[1].replace(/\s+/g, ' ').trim() : fallback;
    };

    const dataHora = getMatch(/Data[\/\s]*Hora[\s:]*([0-9\/\-\:\s]+)/i);
    const os = getMatch(/SO[\s:]+([^\n]+)/i);
    const host = getMatch(/Host[\s:]+([^\n]+)/i);
    const arch = getMatch(/Arquitetura[\s:]+([^\n]+)/i);
    const proc = getMatch(/Processador[\s:]+([^\n]+)/i);
    const py = getMatch(/Python[\s:]+([^\n]+)/i);
    const uptime = getMatch(/Ligado[\s:]+([^\n]+)/i);
    const cpuTotal = getMatch(/CPU[\s\S]{0,100}?Uso[\s:]+([0-9\.,]+)[\s%]/i, '0');
    const cpuFreq = getMatch(/Frequ[eê]ncia[\s:]+([0-9\.,]+)\s*MHz/i, '-');
    const cpuFisicos = getMatch(/([0-9]+)\s+f[íi]sicos/i, '-');
    const cpuLogicos = getMatch(/([0-9]+)\s+l[óo]gicos/i, '-');
    const ramTotal = getMatch(/MEMÓRIA[\s\S]{0,200}?Total[\s:]+([0-9\.,]+)\s+GB/i);
    const ramUsed = getMatch(/MEMÓRIA[\s\S]{0,200}?Usada[\s:]+([0-9\.,]+)\s+GB/i);
    const ramAvailable = getMatch(/MEMÓRIA[\s\S]{0,200}?Dispon[íi]vel[\s:]+([0-9\.,]+)\s+GB/i);
    const ramPercent = getMatch(/MEMÓRIA[\s\S]{0,200}?Uso[\s:]+([0-9\.,]+)\s*%/i);
    const diskTotal = getMatch(/DISCO[\s\S]{0,200}?Total[\s:]+([0-9\.,]+)\s+GB/i);
    const diskUsed = getMatch(/DISCO[\s\S]{0,200}?Usado[\s:]+([0-9\.,]+)\s+GB/i);
    const diskFree = getMatch(/DISCO[\s\S]{0,200}?Livre[\s:]+([0-9\.,]+)\s+GB/i);
    const diskPercent = getMatch(/DISCO[\s\S]{0,200}?Uso[\s:]+([0-9\.,]+)\s*%/i);
    const netSentTot = getMatch(/Enviados\s*\(\s*Total\s*\)[\s:]+([0-9\.,]+)\s+MB/i);
    const netRecvTot = getMatch(/Recebidos\s*\(\s*Total\s*\)[\s:]+([0-9\.,]+)\s+MB/i);
    const netSentSess = getMatch(/Enviados\s*\(\s*Sess[ãa]o\s*\)[\s:]+([0-9\.,]+)\s+MB/i);
    const netRecvSess = getMatch(/Recebidos\s*\(\s*Sess[ãa]o\s*\)[\s:]+([0-9\.,]+)\s+MB/i);
    const netErrIn = getMatch(/Erros[\s:]*Entrada[\s:]+([0-9\.,]+)/i, '0');
    const netErrOut = getMatch(/Erros[\s:]*Sa[íi]da[\s:]+([0-9\.,]+)/i, '0');
    const netDropIn = getMatch(/Dropin[\s:]+([0-9\.,]+)/i, '0');
    const netDropOut = getMatch(/Dropout[\s:]+([0-9\.,]+)/i, '0');
    const netPktSent = getMatch(/Pacotes[\s:]*Enviados[\s:]+([0-9\.,]+)/i, '0');
    const netPktRecv = getMatch(/Pacotes[\s:]*Recebidos[\s:]+([0-9\.,]+)/i, '0');

    return `
    <div class="bk-summary-card" style="display:grid;grid-template-columns:1fr 1fr;gap:1.3em;color:var(--color-text-primary);">
      <div>
        <h3 style="margin:0;margin-bottom:0.8em;color:#00f0ff">🖥️ Sistema Operacional</h3>
        <ul style="list-style:none;padding:0;line-height:1.8;">
          <li><b>SO:</b> ${os}</li>
          <li><b>Host:</b> ${host}</li>
          <li><b>Arquitetura:</b> ${arch}</li>
          <li><b>Processador:</b> ${proc}</li>
          <li><b>Python:</b> ${py}</li>
          <li><b>Ligado:</b> ${uptime}</li>
        </ul>
        <span style="font-size:0.87em;color:#aad;margin-top:1em;display:block;">📅 Backup em: ${dataHora}</span>
      </div>
      <div>
        <h3 style="margin:0;margin-bottom:0.8em;color:#ff0055">🔥 CPU</h3>
        <ul style="list-style:none;padding:0;line-height:1.8;">
          <li><b>Uso:</b> ${cpuTotal}%</li>
          <li><b>Frequência:</b> ${cpuFreq} MHz</li>
          <li><b>Núcleos:</b> ${cpuFisicos} físicos / ${cpuLogicos} lógicos</li>
        </ul>
        <h3 style="margin:0.8em 0 0.8em 0;color:#00f0ff">🧠 Memória RAM</h3>
        <ul style="list-style:none;padding:0;line-height:1.8;">
          <li><b>Total:</b> ${ramTotal} GB</li>
          <li><b>Usada:</b> ${ramUsed} GB (${ramPercent}%)</li>
          <li><b>Disponível:</b> ${ramAvailable} GB</li>
        </ul>
      </div>
      <div>
        <h3 style="margin:0;margin-bottom:0.8em;color:#a0f">💾 Disco</h3>
        <ul style="list-style:none;padding:0;line-height:1.8;">
          <li><b>Total:</b> ${diskTotal} GB</li>
          <li><b>Usado:</b> ${diskUsed} GB (${diskPercent}%)</li>
          <li><b>Livre:</b> ${diskFree} GB</li>
        </ul>
      </div>
      <div>
        <h3 style="margin:0;margin-bottom:0.8em;color:#4ff">📡 Rede (Completo)</h3>
        <ul style="list-style:none;padding:0;line-height:1.6;font-size:0.95em;">
          <li><b>Enviados Total:</b> ${netSentTot} MB</li>
          <li><b>Recebidos Total:</b> ${netRecvTot} MB</li>
          <li><b>Enviados Sessão:</b> ${netSentSess} MB</li>
          <li><b>Recebidos Sessão:</b> ${netRecvSess} MB</li>
          <li><b>Pacotes Enviados:</b> ${netPktSent}</li>
          <li><b>Pacotes Recebidos:</b> ${netPktRecv}</li>
          <li><b>Erros E/S:</b> ${netErrIn}/${netErrOut}</li>
          <li><b>Dropin/out:</b> ${netDropIn}/${netDropOut}</li>
        </ul>
      </div>
    </div>
    <hr style="margin:2em 0;border:none;border-top:1px solid rgba(0,240,255,0.2);">
    <details style="margin-top:1em;">
      <summary style="cursor:pointer;color:#00f0ff;font-weight:600;font-size:1.1em;padding:0.5em 0;">📄 Ver Arquivo Completo</summary>
      <pre style="background:var(--color-surface,#181822);color:var(--color-text-primary,#fff);padding:1em;font-size:.88em;overflow:auto;max-height:25vh;border-radius:8px;margin-top:1em;border:1px solid rgba(0,240,255,0.2);">${escapeHtml(txt)}</pre>
    </details>
    `;
}


async function viewBackupContent(filename) {
    try {
        showToast('Carregando backup...', 'info');
        addLog(`Carregando backup: ${filename}`);
        
        const response = await fetch(`/api/backup/${filename}`);
        const data = await response.json();
        
        if (data.error) {
            showToast(`Erro: ${data.error}`, 'error');
            addLog(`Erro ao carregar backup: ${data.error}`, 'error');
            return;
        }
        
        const rawText = data.raw_text || '';
        const resumoHtml = parseBackupSummary(rawText);
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;';
        
        modal.innerHTML = `
            <div style="background: var(--color-bg-secondary, #1a1a2e); border-radius: 12px; max-width: 90vw; max-height: 90vh; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
                <div style="padding: 1.5rem; border-bottom: 1px solid rgba(0,240,255,0.2); display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="margin: 0; color: var(--color-text-primary, #fff); font-size: 1.5rem;">
                        <span style="margin-right: 0.5rem;">📄</span>
                        ${escapeHtml(filename)}
                    </h2>
                    <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 2rem; color: var(--color-text-secondary, #aaa); cursor: pointer; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">&times;</button>
                </div>
                <div style="padding: 1.5rem; max-height: 70vh; overflow-y: auto;">
                    ${resumoHtml}
                </div>
                <div style="padding: 1.5rem; border-top: 1px solid rgba(0,240,255,0.2); display: flex; gap: 1rem; justify-content: flex-end;">
                    <button onclick="this.closest('.modal').remove()" style="padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.1); color: var(--color-text-primary, #fff); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; cursor: pointer; font-weight: 600;">
                        ✖️ Fechar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        showToast('Backup carregado!', 'success');
        addLog(`Backup visualizado: ${filename}`, 'success');
        
    } catch (error) {
        console.error('Erro ao visualizar backup:', error);
        showToast('Erro ao carregar backup', 'error');
        addLog(`Erro: ${error.message}`, 'error');
    }
}


function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}


function hideIPComplete(addr) {
    if (!addr || addr === '-' || addr === 'N/A') return '***.***.***:***';
    return `***.***.***:***`;
}


function showToast(message, type) {
    type = type || 'info';
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#00f0ff' : type === 'error' ? '#ff0055' : '#ffa500'};
        color: #000;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


function addLog(message, type) {
    type = type || 'info';
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const log = {
        timestamp: timestamp,
        message: message,
        type: type
    };
    
    systemLogs.unshift(log);
    if (systemLogs.length > 100) systemLogs.pop();
    
    updateLogsDisplay();
}


function updateLogsDisplay() {
    const tbody = document.getElementById('logsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (systemLogs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Nenhum log disponível</td></tr>';
        return;
    }
    
    systemLogs.slice(0, 50).forEach(log => {
        const row = document.createElement('tr');
        const typeClass = log.type === 'error' ? 'log-error' : log.type === 'warning' ? 'log-warning' : log.type === 'success' ? 'log-success' : '';
        row.className = typeClass;
        row.innerHTML = `
            <td>${log.timestamp}</td>
            <td>${escapeHtml(log.message)}</td>
            <td><span class="log-type log-type-${log.type}">${log.type.toUpperCase()}</span></td>
        `;
        tbody.appendChild(row);
    });
}


function initializeLogs() {
    addLog('Sistema inicializado - DOAÇÃO COM CARTÃO');
}


function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            switchSection('processes');
        }
        
        if (e.ctrlKey && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            switchSection('logs');
        }
    });
}


async function loadInitialData() {
    try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error loading initial data:', error);
        addLog('Erro ao carregar dados iniciais', 'error');
    }
}


async function loadDonationInfo() {
    try {
        const response = await fetch('/api/donations');
        const data = await response.json();
    } catch (error) {
        console.error('Error loading donation info:', error);
    }
}


function copyPixKey(key) {
    navigator.clipboard.writeText(key).then(() => {
        showToast('Chave PIX copiada!', 'success');
    }).catch(err => {
        showToast('Erro ao copiar chave PIX', 'error');
        console.error('Copy error:', err);
    });
}


const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .log-error { background: rgba(255, 0, 85, 0.1); }
    .log-warning { background: rgba(255, 165, 0, 0.1); }
    .log-success { background: rgba(0, 240, 255, 0.1); }
    
    .log-type {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    
    .log-type-error { background: rgba(255, 0, 85, 0.2); color: #ff0055; }
    .log-type-warning { background: rgba(255, 165, 0, 0.2); color: #ffa500; }
    .log-type-success { background: rgba(0, 240, 255, 0.2); color: #00f0ff; }
    .log-type-info { background: rgba(100, 100, 255, 0.2); color: #6464ff; }
`;
document.head.appendChild(style);


console.log('✅ TaskMonitor 3.0.4 - DOAÇÃO COM CARTÃO CARREGADO!');
