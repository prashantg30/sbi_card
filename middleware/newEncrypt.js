const crypto = require('crypto');
const fs = require('fs');

// Step 1: Generate Key


const salt = crypto.randomBytes(20);
let key = crypto.pbkdf2Sync('API', salt, 65536, 32, 'sha1');
key = key.toString('base64');
let iv = crypto.randomBytes(16).toString('hex');

async function encryptData(data, txnId){
    try{
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'base64'), Buffer.from(iv, 'hex'));
        let encryptedData = cipher.update(data, 'utf-8', 'base64');
        encryptedData += cipher.final('base64');
        const token = Buffer.from(`${iv}|${key}`).toString('base64');
        //const publicKey = fs.readFileSync('public.pem', 'utf-8'); // Assuming public.pem contains the RSA public key
        const certFile = fs.readFileSync('./sprint.pem');
        let publicKey = crypto.createPublicKey(certFile);
        publicKey = publicKey.export({ type: 'spki', format: 'pem'});
        // const encryptedToken = crypto.publicEncrypt(publicKey, Buffer.from(token, 'base64')).toString('base64');
        const encryptedToken = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, Buffer.from(token, 'utf8')).toString('base64');
       return { "encRequest": encryptedData, "encToken": encryptedToken }

    }catch(err){
        console.error(`[TXN_ID]: ${txnId}:::[ERR] while encrypting data is:::`, err);
        return false
    }   
}
// const generateKey = () => {
//     const salt = crypto.randomBytes(20);
//     const key = crypto.pbkdf2Sync('API', salt, 65536, 32, 'sha1');
//     return key.toString('base64');
// };

// Step 2: Generate IV
// const generateIV = () => {
//     return crypto.randomBytes(16).toString('hex');
// };

// Step 3: Encrypt Data
// const encryptData = (data, key, iv) => {
//     const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'base64'), Buffer.from(iv, 'hex'));
//     let encryptedData = cipher.update(data, 'utf-8', 'base64');
//     encryptedData += cipher.final('base64');
//     return encryptedData;
// };

// Step 4: Encrypt Token
// const encryptToken = (iv, key) => {
//     const token = Buffer.from(`${iv}|${key}`).toString('base64');
//     //const publicKey = fs.readFileSync('public.pem', 'utf-8'); // Assuming public.pem contains the RSA public key
//     const certFile = fs.readFileSync('./sprint.pem');
//     let publicKey = crypto.createPublicKey(certFile);
//     publicKey = publicKey.export({ type: 'spki', format: 'pem'});
//     // const encryptedToken = crypto.publicEncrypt(publicKey, Buffer.from(token, 'base64')).toString('base64');
//     const encryptedToken = crypto.publicEncrypt({
//         key: publicKey,
//         padding: crypto.constants.RSA_PKCS1_PADDING
//     }, Buffer.from(token, 'utf8')).toString('base64');
//     return encryptedToken;
// };

// Step 5: API call with encrypted data and token
// const makeAPICall = (encryptedData, encryptedToken) => {
//     // Send the encryptedData and encryptedToken as part of the API call
//     console.log({ "encRequest": encryptedData, "encToken": encryptedToken });
// };

// Step 6: Decrypt Data
async function decryptData (encryptedData, txnId) {
    try{
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'base64'), Buffer.from(iv, 'hex'));
        let decryptedData = decipher.update(encryptedData, 'base64', 'utf-8');
        decryptedData += decipher.final('utf-8');
        return decryptedData;
    }catch(err){
        console.error(`[TXN_ID]: ${txnId}:::[ERR] while encrypting data is:::`, err);
        return false
    }
};

// Main execution
// const key = generateKey();
// const iv = generateIV();
// const data = "{\"user\":\"testUser\",\"pass\":\"test@1234\"}";

// const encryptedData = encryptData(data, key, iv);
// const encryptedToken = encryptToken(iv, key);

// makeAPICall(encryptedData, encryptedToken);

// // Simulate receiving response from API
// const response = {
//     "encRequest": encryptedData,
//     "encToken": encryptedToken
// };

// // Decrypt data from response
// const decryptedData = decryptData(response.encRequest, key, iv);
// console.log("Decrypted Data:", decryptedData);


module.exports = { encryptData, decryptData}