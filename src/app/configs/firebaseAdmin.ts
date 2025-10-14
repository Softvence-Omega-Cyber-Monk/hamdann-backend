import admin from "firebase-admin";

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("🔥 FIREBASE_SERVICE_ACCOUNT env variable is missing");
}

// Parse JSON from env
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

// Fix the private_key line breaks
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const messaging = admin.messaging();
export const db = admin.firestore();
export default admin;
