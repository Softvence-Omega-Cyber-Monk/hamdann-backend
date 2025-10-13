"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.messaging = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// If using CommonJS (tsc default module), __dirname exists
const serviceAccountPath = path_1.default.join(__dirname, "serviceAccountKey.json");
const serviceAccount = JSON.parse(fs_1.default.readFileSync(serviceAccountPath, "utf8"));
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
}
exports.messaging = firebase_admin_1.default.messaging();
exports.db = firebase_admin_1.default.firestore();
exports.default = firebase_admin_1.default;
