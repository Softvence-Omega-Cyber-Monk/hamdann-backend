"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.messaging = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// Ensure the environment variable exists
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("🔥 FIREBASE_SERVICE_ACCOUNT env variable is missing");
}
// Parse the JSON from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
}
// Export messaging and Firestore instances
exports.messaging = firebase_admin_1.default.messaging();
exports.db = firebase_admin_1.default.firestore();
exports.default = firebase_admin_1.default;
