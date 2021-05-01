"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = exports.category = void 0;
var fs_1 = __importDefault(require("fs"));
var process_1 = __importDefault(require("process"));
var path_1 = __importDefault(require("path"));
var token = '';
exports.token = token;
if (fs_1.default.existsSync(path_1.default.join(__dirname, './secret.js'))) {
    exports.token = token = require('./secret');
    if (!token) {
        console.error('secret.js empty.');
        process_1.default.exit(1);
    }
}
else {
    console.error('./secret.js not found.');
    process_1.default.exit(1);
}
var category = {
    text: '',
    voice: '',
    recruit: '',
    text_cp: '',
    voice_cp: ''
};
exports.category = category;
if (fs_1.default.existsSync(path_1.default.join(__dirname, './category.js'))) {
    exports.category = category = require('./category');
    if (!token) {
        console.error('category.js empty.');
        process_1.default.exit(1);
    }
}
else {
    console.error('./category.js not found.');
    process_1.default.exit(1);
}
