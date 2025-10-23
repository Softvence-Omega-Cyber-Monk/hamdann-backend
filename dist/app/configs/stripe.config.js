"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const index_1 = require("./index");
if (!index_1.configs.stripe.secret_key) {
    throw new Error("Stripe secret key is missing in environment variables!");
}
exports.stripe = new stripe_1.default(index_1.configs.stripe.secret_key);
