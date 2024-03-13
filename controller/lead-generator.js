const { encryptData, decryptData } = require("../middleware/newEncrypt");
const oAuth = require("./auth-controller");

const lead_generator = async (req, res) => {
    try {
        const data = await oAuth()
        const finalEncryptedData = await encryptData(req.body)
        if (data) {
            const { token, cookie } = data
            const options = {
                url: process.env.baseUrl + `/api-gateway/resource/swiftapp-partner/lead-generator`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'IDENTIFIER_1': process.env.identifier_1,
                    'Authorization': token,
                    'Cookie': cookie
                },
                data: finalEncryptedData
            };

            console.log(`[INFO] preparing request options to get lead_generator is`, JSON.stringify(options));

            try {
               const responseEncr = await axios(options)
                const responseDecr = await decryptData(responseEncr)
               if(responseDecr){
                 return res.status(200).send(responseDecr)
               }
            } catch (err) {
                console.error(`[ERR] while getting lead_generator from SBI server is:::`, err);
                return false
            }

        }

    } catch (err) {
        console.error(`[ERR] while getting lead_generator from SBI server is:::`, err);
        return false
    }

}
module.exports = { lead_generator }