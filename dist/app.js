"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultSuperAdmin = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const global_error_handler_1 = __importDefault(require("./app/middlewares/global_error_handler"));
const not_found_api_1 = __importDefault(require("./app/middlewares/not_found_api"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const user_schema_1 = require("./app/modules/user/user.schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const configs_1 = require("./app/configs");
const stripe_config_1 = require("./app/configs/stripe.config");
const payment_model_1 = require("./app/modules/payment/payment.model");
const order_model_1 = require("./app/modules/order/order.model");
// define app
const app = (0, express_1.default)();
// middleware
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
}));
app.use(express_1.default.json({ limit: "100mb" }));
app.use(express_1.default.raw());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1", routes_1.default);
// stating point
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running successful !!",
        data: null,
    });
});
// ✅ Success payment route
// app.get("/payment-success", async (req: Request, res: Response) => {
//   try {
//     const { session_id } = req.query;
//     if (!session_id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Session ID required" });
//     }
//     const session = await stripe.checkout.sessions.retrieve(
//       session_id as string
//     );
//     if (session.payment_status === "paid") {
//       const payment = await Payment.findOneAndUpdate(
//         { paymentIntentId: session.id },
//         { paymentStatus: "succeeded" },
//         { new: true }
//       );
//       const orderId = session.metadata?.orderId;
//       // 2️⃣ Update Order status + statusDates
//       const order = await Order.findByIdAndUpdate(
//         orderId,
//         {
//           status: "payment_processed",
//           "statusDates.paymentProcessedAt": new Date(), // ✅ update nested field
//         },
//         { new: true }
//       ).populate({
//         path: "items.productId",
//         select: "name price image", // populate product info
//       });
//       return res.status(200).json({
//         success: true,
//         message: "Payment successful",
//         session,
//         payment,
//         order,
//       });
//     }
//     res
//       .status(200)
//       .json({ success: false, message: "Payment not completed", session });
//   } catch (error) {
//     res.status(500).json({ success: false, message: (error as Error).message });
//   }
// });
app.get("/payment-success", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { session_id } = req.query;
        if (!session_id)
            return res.status(400).json({ success: false, message: "Session ID required" });
        const session = yield stripe_config_1.stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === "paid") {
            // Update payment status
            const payment = yield payment_model_1.Payment.findOneAndUpdate({ paymentIntentId: session.id }, { paymentStatus: "succeeded" }, { new: true });
            // Update order
            const orderId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.orderId;
            const order = yield order_model_1.Order.findByIdAndUpdate(orderId, {
                status: "payment_processed",
                "statusDates.payment_processed": new Date(),
            }, { new: true }).populate("items.productId");
            // 🔹 Transfer to sellers
            if ((_b = session.metadata) === null || _b === void 0 ? void 0 : _b.sellers) {
                const sellers = JSON.parse(session.metadata.sellers);
                for (const { stripeAccountId, amount, sellerId, orderId } of sellers) {
                    // ⚠️ Make sure amount is in cents
                    yield stripe_config_1.stripe.transfers.create({
                        amount: Math.round(amount * 100),
                        currency: session.currency || "aed",
                        destination: stripeAccountId,
                        metadata: { orderId, sellerId },
                    });
                }
            }
            return res.status(200).json({
                success: true,
                message: "Payment successful and transfers completed",
                session,
                payment,
                order,
            });
        }
        res.status(200).json({ success: false, message: "Payment not completed", session });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// Create Default SuperAdmin if not exists
const createDefaultSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingAdmin = yield user_schema_1.User_Model.findOne({
            email: "mdsoyaibsourav11@gmail.com",
        });
        const hashedPassword = yield bcrypt_1.default.hash("admin@123", // Default password for Admin
        Number(configs_1.configs.bcrypt_salt_rounds) // Ensure bcrypt_salt_rounds is correctly pulled from config
        );
        if (!existingAdmin) {
            yield user_schema_1.User_Model.create({
                name: "Hamdan",
                email: "mdsoyaibsourav11@gmail.com",
                password: hashedPassword,
                confirmPassword: hashedPassword,
                role: "Admin",
                country: "Global",
            });
            console.log("✅ Default Admin created.");
        }
        else {
            console.log("ℹ️ SAdmin already exists.");
        }
    }
    catch (error) {
        console.error("❌ Failed to create Default Admin:", error);
    }
});
exports.createDefaultSuperAdmin = createDefaultSuperAdmin;
(0, exports.createDefaultSuperAdmin)();
// global error handler
app.use(global_error_handler_1.default);
app.use(not_found_api_1.default);
// export app
exports.default = app;
