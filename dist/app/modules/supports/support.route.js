"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportRoutes = void 0;
const express_1 = __importDefault(require("express"));
const support_controller_1 = require("./support.controller");
const router = express_1.default.Router();
router.post("/create", support_controller_1.SupportController.createSupport);
router.get('/getSupport/:id', support_controller_1.SupportController.getSupport);
router.get("/user/:userId", support_controller_1.SupportController.getUserSupports);
router.get("/getAllSupport", support_controller_1.SupportController.getAllSupports);
router.get("/statistics", support_controller_1.SupportController.getSupportStats);
router.post("/:id/reply", support_controller_1.SupportController.createReply);
exports.supportRoutes = router;
