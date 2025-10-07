"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageResponse = void 0;
// const manageResponse = <T>(res: Response, payload: IResponse<T>) => {
//     res.status(payload.statusCode).json({
//         success: payload.success,
//         message: payload.message,
//         data: payload.data || undefined || null,
//         meta: payload.meta || undefined || null
//     })
// }
const manageResponse = (res, data) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data || null,
    });
};
exports.manageResponse = manageResponse;
exports.default = exports.manageResponse;
