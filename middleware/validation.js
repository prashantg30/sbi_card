const checkSchemaValidation = (schema) => {
    try{
        return (req, res, next)=> {
           const value = schema.validate(req.body);
           if(value.error){
             return res.status(400).send({status: "failed", errMsg: `Payload validation failed with error:: ${value.error}`})
           }
           next()
    }
    }catch(error){
        console.error(`[Err] while validating schema is::`, error)
        return res.status(400).send({ status: "failed", errMsg: `Payload validation failed with error:: ${error}`})
    }
}
module.exports = checkSchemaValidation