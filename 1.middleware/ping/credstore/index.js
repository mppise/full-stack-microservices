const jose = require('node-jose');
const axios = require('axios');
const credentials = {
   "username": process.env['CREDSTORE_USERNAME'],
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

/*

//  --------------------------
//   **** Unit Tests ****
//  --------------------------
_joseKey("public").then((joseKey) => console.log(joseKey));

_decryptPayload("eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwiaWF0IjoxNjcyNzA1NTc4fQ.eNG05KyUcednu36KSa3Hj3Zj121T5556ZR0EdOj4YwfboYxzmHUEQk0vVV-AC4t4qgw3k8SgZUgYCUxX1EJdahsg8yNKYteRJEygQN9ogRVWryq5asYdrHOLbCQ7aVfgf3Oi44eG6WK0FZ0h7_LO-0e9RHD0galIUjDIm2Y3l4rnaTL1C6CDtTqxhBBoloWiVFupnb_nnX6vcgZ0mO8uqBC6PUaqA6hDwAwVOoEhhTiglgUR9rv_QOQYFKTU0dkt-knF-vij80GL4caCn46VWMv8xGjlDKS_KXDsmFCn9Sv_fPbJCeTnOks10KvHrx3fgR9AMjUCtgmvbWh0HVJpaP0Ly1z8-LsihStmwOdxWc7GsIUZW29QVN0TkXQtLuSx-VmL_7JKMb0RfWlkFt3yO5n4LUdSlOP0Cbbob6GIHv2deCyLc6VaqfkKlP5KJJK2Fn4PPIUkNPO1sdSue0JhZWSsuNOARvIVcrGvilSeXhJpY8jTRX-ZmT2VvbVgcGOS.uFGemLzk5PZZZvR4.Majc7RDEh-uOugGfujg9q9jprVxME0-7kN50H02sOKdojLB2lmIOC2lH4v7VbEg-QVUpfTwiY9J5fACOsQb6Hv0H4MvxlYwPVc3s3gJgiFZhsHnYcwQPAP2E8srjQaRG-sKNVZMQNpOJZ9jk3mRMYzfR-siO9aErPIYXGCDLvyiISM4zHZ7eJ_MNIVPssMgKuWysEIskhblToMRrHN_kkUKpOJICElhZIa3UVsj1QUI-zpqj-E4JU-pHrYFCMsK1j__RMKuGXbeE0Hf-9byKEd7_NfIVJw13-ew.LlePWDX5WHBMLGzD0Yeztg")
   .then((payload) => {
      console.log(payload);
   }).catch((err) => console.log(err));

_encryptPayload({
   name: "key2",
   value: jose.util.randomBytes(32).toString("base64")
}).then((payload) => {
   console.log(payload);
}).catch((err) => console.log(err));

let keyName = "key5"
writeKeyToStore(keyName);
readKeyFromStore(keyName);
deleteKeyFromStore(keyName);

*/