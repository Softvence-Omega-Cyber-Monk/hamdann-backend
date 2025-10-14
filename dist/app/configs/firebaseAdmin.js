"use strict";
// import admin from "firebase-admin";
// import path from "path";
// import fs from "fs";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.messaging = void 0;
// // If using CommonJS (tsc default module), __dirname exists
// const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
// const serviceAccount = JSON.parse(
//   fs.readFileSync(serviceAccountPath, "utf8")
// ) as admin.ServiceAccount;
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }
// export const messaging = admin.messaging();
// export const db = admin.firestore();
// export default admin;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    });
}
exports.messaging = firebase_admin_1.default.messaging();
exports.db = firebase_admin_1.default.firestore();
exports.default = firebase_admin_1.default;
