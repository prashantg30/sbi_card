const axios = require('axios'); 
const { encryptData, decryptData } = require('../middleware/newEncrypt');
const crypto = require('crypto')

async function oAuth() {
    let txnId = crypto.randomUUID()
    try{
        let requestData = {
            user: process.env.user,
            pass: process.env.pass
        }
        let finalEncryptedData = await encryptData(JSON.stringify(requestData), txnId)
        if(!finalEncryptedData){
            return false
        }
        const options = {
            url: process.env.baseUrl + `/api-gateway/resource/oAuth/tokenGenPartner`,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'IDENTIFIER_1' : process.env.identifier_1
            },
            data: finalEncryptedData
        };

        console.log(`[TXN_ID]: ${txnId}:::[INFO] preparing request options to get token is`, JSON.stringify(options));

        try{
           var data = await axios(options) 
        }catch(err){
            console.error(`[TXN_ID]: ${txnId}:::[ERR] while getting token from SBI server is:::`, err);
            return false
        }

        console.log(`[TXN_ID]: ${txnId}:::[INFO] encrypted response from SBI server is::`, JSON.stringify(data))

        if(typeof data === 'string'){
            try{
                data = JSON.parse(data)
            }catch(err){
                console.error(`[TXN_ID]: ${txnId}:::[ERR] while parsing stringified data of SBI server is:::`, err);
                return false
            }
        }
        const decryptDataa = await decryptData(data?.encResponse, txnId)
        if(!decryptDataa){
            return false
        }

        console.log(`[TXN_ID]: ${txnId}:::[ERR] decrypted response is:::`, JSON.stringify(decryptData));

        if(decryptDataa.status === 'Success'){
            let finalData = {
                txnId: txnId,
                token: decryptDataa?.data?.accessToken,
                cookie: decryptDataa?.data?.xSbicUserFgp
            }
            return finalData
        }else{
            return false
        }

    }catch(err){
        console.error(`[TXN_ID]: ${txnId}:::[ERR] while getting auth token from SBI system is::`, err);
        return false
    }
}