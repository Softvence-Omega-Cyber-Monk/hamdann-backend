"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account_Model = void 0;
const mongoose_1 = require("mongoose");
const authSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    deviceToken: { type: String, requried: true },
}, {
    timestamps: true,
});
exports.Account_Model = (0, mongoose_1.model)("auth", authSchema);
