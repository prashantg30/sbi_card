const crypto = require('crypto');
const fs = require('fs');

function createKey(TOKEN, data) {
    const keyFactoryAlgorithm = 'PBKDF2WithHmacSHA1';
    const iterations = 65536;
    const keySize = 256;
    const salt = crypto.randomBytes(20); // Random byte array of size 20
    const keyAlgorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);

    // Read the certificate file
    const certFile = fs.readFileSync('./sprint.pem');

    // Extract the public key from the certificate
    let publicKey = crypto.createPublicKey(certFile);

    publicKey = publicKey.export({ type: 'spki', format: 'pem'});

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(TOKEN, salt, iterations, keySize / 8, 'sha1', (err, derivedKey) => {
            if (err) {
                reject(err);
            } else {
                const cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);
                let encryptedData = cipher.update(data, 'utf-8', 'hex');
                encryptedData += cipher.final('hex');
                const encryptedBase64 = Buffer.from(encryptedData, 'hex').toString('base64');

                const ivBase64 = iv.toString('base64');
                const keyBase64 = derivedKey.toString('base64');
                const concatenatedToken = ivBase64 + "|" + keyBase64;

                // Encrypt concatenated token using RSA algorithm and sprint.pem public key
                const encryptedToken = crypto.publicEncrypt({
                    key: publicKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING
                }, Buffer.from(concatenatedToken, 'utf8')).toString('base64');

                // Decrypt data using generated key and IV
                const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, Buffer.from(ivBase64, 'base64'));
                let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
                decryptedData += decipher.final('utf-8');

                resolve({
                    key: keyBase64,
                    salt: salt.toString('hex'),
                    keyAlgorithm: keyAlgorithm,
                    iv: ivBase64,
                    encryptedData: encryptedBase64,
                    concatenatedToken: concatenatedToken,
                    encryptedToken: encryptedToken,
                    decryptedData: decryptedData
                });
            }
        });
    });
}

// Example usage:
const TOKEN = "Partner-API";
const data = "{\"user\":\"testUser\",\"pass\":\"test@1234\"}";
createKey(TOKEN, data)
    .then(keyData => {
        // console.log("Base64 Encoded Key:", keyData.key);
        // console.log("Salt:", keyData.salt);
        // console.log("Key Algorithm:", keyData.keyAlgorithm);
        // console.log("Initialization Vector (IV):", keyData.iv);
        console.log("Encrypted Data (Base64):", {encRequest: keyData.encryptedData, encToken: keyData.encryptedToken});
        // console.log("Concatenated Token:", keyData.concatenatedToken);
        // console.log("Encrypted Token:", keyData.encryptedToken);
        console.log("Decrypted Data:", keyData.decryptedData);
    })
    .catch(err => {
        console.error("Error:", err);
    });
