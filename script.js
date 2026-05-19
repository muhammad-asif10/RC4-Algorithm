let abortController = null;

const sboxContainer = document.getElementById('sbox');
const cells = [];
for (let i = 0; i < 256; i++) {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.innerText = i;
    sboxContainer.appendChild(div);
    cells.push(div);
}

const stringToBytes = (str) => Array.from(str).map(c => c.charCodeAt(0));
const bytesToString = (bytes) => bytes.map(b => String.fromCharCode(b)).join('');
const bytesToHex = (bytes) => bytes.map(b => b.toString(16).padStart(2, '0')).join('');
const hexToBytes = (hex) => {
    let bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substring(i, i + 2), 16));
    }
    return bytes;
};

const sleep = (ms, signal) => new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    if (signal) {
        signal.addEventListener('abort', () => {
            clearTimeout(timer);
            reject(new Error('Aborted'));
        });
    }
});

function updateGrid(S, i = -1, j = -1, k = -1) {
    for (let x = 0; x < 256; x++) {
        cells[x].innerText = S[x];
        cells[x].className = 'cell';
        if (x === i) cells[x].classList.add('i-active');
        if (x === j) cells[x].classList.add('j-active');
        if (x === k) cells[x].classList.add('k-active');
    }
}

function appendLog(text) {
    const logArea = document.getElementById('stepInfo');
    logArea.innerHTML += text + "\n";
    logArea.scrollTop = logArea.scrollHeight;
}

function setStatus(text) {
    document.getElementById('status').innerText = text;
}

async function runInteractiveRC4(action) {
    if (abortController) abortController.abort();
    abortController = new AbortController();
    const signal = abortController.signal;

    document.getElementById('stepInfo').innerHTML = '';
    document.getElementById('finalOutput').innerText = '-';
    
    const keyStr = document.getElementById('key').value;
    const inputStr = document.getElementById('inputData').value;
    const speed = parseInt(document.getElementById('speed').value);

    if (!keyStr || !inputStr) {
        setStatus("ERROR: Missing Key or Input Data.");
        return;
    }

    try {
        const key = stringToBytes(keyStr);
        let data;
        
        if (action === 'encrypt') {
            data = stringToBytes(inputStr);
        } else {
            const cleanHex = inputStr.replace(/\s+/g, '');
            data = hexToBytes(cleanHex);
            if (data.some(isNaN)) throw new Error("Invalid Hex");
        }

        let S = Array.from({length: 256}, (_, i) => i);
        
        setStatus("PHASE 1: KSA (Key-Scheduling Algorithm)");
        appendLog("Initializing S-Box based on Secret Key...");
        
        let j = 0;
        for (let i = 0; i < 256; i++) {
            j = (j + S[i] + key[i % key.length]) % 256;
            updateGrid(S, i, j);
            
            let temp = S[i];
            S[i] = S[j];
            S[j] = temp;
            
            await sleep(speed, signal);
        }
        appendLog("KSA Complete. S-Box scrambled.\n");

        setStatus("PHASE 2: PRGA & XOR Operations");
        const prgaSpeed = Math.max(speed * 3, 100); 

        let i = 0;
        j = 0;
        let result = [];

        for (let x = 0; x < data.length; x++) {
            i = (i + 1) % 256;
            j = (j + S[i]) % 256;
            
            let temp = S[i];
            S[i] = S[j];
            S[j] = temp;
            
            let t = (S[i] + S[j]) % 256;
            let K = S[t]; 
            
            updateGrid(S, i, j, t);
            
            let inputByte = data[x];
            let outputByte = inputByte ^ K;
            result.push(outputByte);
            
            appendLog(`Byte ${x}: i=${i}, j=${j}, t=${t}, K=${K}, In^K=${outputByte}`);
            await sleep(prgaSpeed, signal);
        }
        
        updateGrid(S); 

        setStatus("DONE");
        if (action === 'encrypt') {
            const hexResult = bytesToHex(result).toUpperCase();
            document.getElementById('finalOutput').innerText = hexResult;
            appendLog(`\nEncrypted Hex: ${hexResult}`);
        } else {
            const textResult = bytesToString(result);
            document.getElementById('finalOutput').innerText = textResult;
            appendLog(`\nDecrypted Text: ${textResult}`);
        }

    } catch (e) {
        if (e.message !== 'Aborted') setStatus("ERROR: " + e.message);
    }
}

document.getElementById('btnEncrypt').addEventListener('click', () => runInteractiveRC4('encrypt'));
document.getElementById('btnDecrypt').addEventListener('click', () => runInteractiveRC4('decrypt'));