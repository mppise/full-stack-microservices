const jose = require('node-jose');
const axios = require('axios');
const credentials = {
   "username": process.env['CREDSTORE_USERNAME'],
   "password": process.env['CREDSTORE_PASSWORD'],
   "url": process.env['CREDSTORE_URL'],
   "encryption": JSON.parse(process.env['CREDSTORE_ENCRYPTION'])
};

const _joseKey = (type) => {
   // type = "PUBLIC" or "PRIVATE"
   let cert;
   if (type.toUpperCase() == "PRIVATE")
      cert = "-----BEGIN PRIVATE KEY-----\n" + credentials.encryption.client_private_key + "\n-----END PRIVATE KEY-----";
   else if (type.toUpperCase() == "PUBLIC")
      cert = "-----BEGIN PUBLIC KEY-----\n" + credentials.encryption.server_public_key + "\n-----END PUBLIC KEY-----";
   else
      console.error("joseKey :: Requires 'public' or 'private' as parameter");
   return jose.JWK.asKey(cert, "pem", { alg: "RSA-OAEP-256", enc: "A256GCM" })
}; // joseKey

const _decryptPayload = (payload) => {
   return new Promise((resolve, reject) => {
      _joseKey("private").then((joseKey) => {
         jose.JWE.createDecrypt(joseKey).decrypt(payload)
            .then((decryptedPayload) => resolve(JSON.parse(decryptedPayload.plaintext.toString())))
            .catch((err) => reject(err));
      });
   });
}; // decryptPayload

const _encryptPayload = (payload) => {
   return new Promise((resolve, reject) => {
      _joseKey("public").then((joseKey) => {
         jose.JWE.createEncrypt({
            contentAlg: "A256GCM",
            compact: true,
            fields: { iat: Math.round(new Date().getTime() / 1000) }
         }, joseKey).update(JSON.stringify(payload)).final()
            .then((encryptedPayload) => resolve(encryptedPayload))
            .catch((err) => reject(err));
      });
   });
}; // encryptPayload

const writeKeyToStore = (nameSpace, keyName, data) => {
   return new Promise((resolve, reject) => {
      if (keyName) {
         let keyValue = jose.util.randomBytes(32).toString("base64");
         let payload = {
            name: keyName,
            value: keyValue,
            metadata: JSON.stringify(data) || ""
         };
         _encryptPayload(payload).then((encryptedPayload) => {
            axios({
               method: 'POST',
               url: credentials.url + "/key",
               headers: {
                  'Authorization': 'Basic ' + Buffer.from(credentials.username + ":" + credentials.password).toString('base64'),
                  'Content-Type': 'application/jose',
                  'sapcp-credstore-namespace': nameSpace
               },
               data: encryptedPayload
            }).then((resp) => {
               resolve({
                  value: keyValue,
                  jwe: resp.data
               });
            }).catch((err) => resolve({
               error: err.code,
               message: err.message
            }));
         }).catch((err) => reject(err));
      }
      else
         console.error("writeKeyToStore :: key name must be present in payload");
   });
}; // writeKeyToStore

const readKeyFromStore = (nameSpace, keyName) => {
   return new Promise((resolve, reject) => {
      axios({
         method: 'GET',
         url: credentials.url + "/key?name=" + encodeURIComponent(keyName),
         headers: {
            'Authorization': 'Basic ' + Buffer.from(credentials.username + ":" + credentials.password).toString('base64'),
            'sapcp-credstore-namespace': nameSpace
         }
      }).then((resp) => {
         _decryptPayload(resp.data)
            .then((key) => resolve(key))
            .catch((err) => reject(err));
      }).catch((err) => resolve({
         error: err.code,
         message: err.message
      }));
   });
}; // readKeyFromStore

const deleteKeyFromStore = (nameSpace, keyName) => {
   return new Promise((resolve, reject) => {
      axios({
         method: 'DELETE',
         url: credentials.url + "/key?name=" + encodeURIComponent(keyName),
         headers: {
            'Authorization': 'Basic ' + Buffer.from(credentials.username + ":" + credentials.password).toString('base64'),
            'sapcp-credstore-namespace': nameSpace
         }
      }).then((resp) => {
         resolve(resp.data);
      }).catch((err) => resolve({
         error: err.code,
         message: err.message
      }));
   });
}; // deleteKeyFromStore

exports.readKey = readKeyFromStore;
exports.writeKey = writeKeyToStore;
exports.deleteKey = deleteKeyFromStore;
