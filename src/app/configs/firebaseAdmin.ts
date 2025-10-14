import admin from "firebase-admin";
import path from "path";
import fs from "fs";

// If using CommonJS (tsc default module), __dirname exists
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
) as admin.ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const messaging = admin.messaging();
export const db = admin.firestore();
export default admin;




// import admin from "firebase-admin";

// if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
//   throw new Error("🔥 FIREBASE_SERVICE_ACCOUNT env variable is missing");
// }

// // Parse JSON from env
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

// // Fix the private_key line breaks
// serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// export const messaging = admin.messaging();
// export const db = admin.firestore();
// export default admin;