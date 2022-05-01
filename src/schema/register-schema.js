"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
var express_validator_1 = require("express-validator");
var schema = [
    express_validator_1.body('email')
        .isEmail()
        .withMessage('email must contain a valid email address'),
    express_validator_1.body('password')
        .isLength({ min: 5 })
        .withMessage('password must be at least 5 characters long'),
];
exports.registerSchema = schema;
