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
exports.isAccountExist = void 0;
const user_schema_1 = require("../modules/user/user.schema");
const app_error_1 = require("./app_error");
const http_status_1 = __importDefault(require("http-status"));
const isAccountExist = (email, populateField) => __awaiter(void 0, void 0, void 0, function* () {
    let isExistAccount;
    if (populateField) {
        isExistAccount = yield user_schema_1.User_Model.findOne({ email }).populate(populateField);
    }
    else {
        isExistAccount = yield user_schema_1.User_Model.findOne({ email });
    }
    // check account
    if (!isExistAccount) {
        throw new app_error_1.AppError("Account not found!!", http_status_1.default.NOT_FOUND);
    }
    // if (isExistAccount.isDeleted) {
    //     throw new AppError("Account deleted !!", httpStatus.BAD_REQUEST)
    // }
    // if (isExistAccount.accountStatus == "INACTIVE") {
    //     throw new AppError("Account is temporary suspend, contact us on support !!", httpStatus.BAD_REQUEST)
    // }
    // if (isExistAccount.accountStatus == "SUSPENDED") {
    //     throw new AppError("Account is suspended !!", httpStatus.BAD_REQUEST)
    // }
    return isExistAccount;
});
exports.isAccountExist = isAccountExist;
