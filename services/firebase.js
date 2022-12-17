var fbadmin = require("firebase-admin");

var serviceAccount = require("../private/service-property-firebase-adminsdk-axzz4-d1f255ca64.json");

const admin = fbadmin.initializeApp({
    credential: fbadmin.credential.cert(serviceAccount),
    storageBucket: "gs://service-property.appspot.com",
});

module.exports = admin;
