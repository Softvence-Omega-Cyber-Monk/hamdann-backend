"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishlist = void 0;
// models/Wishlist.ts
const mongoose_1 = require("mongoose");
const wishlistSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    withlistProducts: [
        { type: String, ref: "Product" }
    ],
}, { timestamps: true });
exports.Wishlist = (0, mongoose_1.model)("Wishlist", wishlistSchema);
