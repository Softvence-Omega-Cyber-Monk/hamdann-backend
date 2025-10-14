import admin from "firebase-admin";

// Ensure the environment variable exists
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("🔥 FIREBASE_SERVICE_ACCOUNT env variable is missing");
}

// Parse the JSON from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export messaging and Firestore instances
export const messaging = admin.messaging();
export const db = admin.firestore();
export default admin;
