const ENCRYPTION_KEY = '12345678901234567890123456789012';
const IV_LENGTH = 16;

const ab2hex = ab => Array.from(new Uint8Array(ab)).map(b => b.toString(16).padStart(2, '0')).join('');
const hex2ab = hex => new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const cryptoKey = crypto.subtle.importKey('raw', new TextEncoder().encode(ENCRYPTION_KEY), 'AES-CBC', false, ['encrypt', 'decrypt']);

async function encrypt(text) {
    let iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    let encrypted = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, await cryptoKey, new TextEncoder().encode(text));
    return ab2hex(iv) + ':' + ab2hex(new Uint8Array(encrypted));
}

async function decrypt(text) {
    let [iv, encryptedText] = text.split(':').map(hex2ab);
    let decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, await cryptoKey, encryptedText);
    return new TextDecoder().decode(decrypted);
}

function encryptText() {
    encrypt(document.getElementById('text-to-encrypt').value).then(res => document.getElementById('encrypted-text').value = res);
}

function decryptText() {
    decrypt(document.getElementById('text-to-decrypt').value).then(res => document.getElementById('decrypted-text').value = res);
}
