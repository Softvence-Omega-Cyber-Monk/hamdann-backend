"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const global_error_handler_1 = __importDefault(require("./app/middlewares/global_error_handler"));
const not_found_api_1 = __importDefault(require("./app/middlewares/not_found_api"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
// define app
const app = (0, express_1.default)();
// middleware
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"]
}));
app.use(express_1.default.json({ limit: "100mb" }));
app.use(express_1.default.raw());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1", routes_1.default);
// stating point
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running successful !!',
        data: null,
    });
});
// global error handler
app.use(global_error_handler_1.default);
app.use(not_found_api_1.default);
// export app
exports.default = app;
