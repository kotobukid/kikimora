import fs from "fs";
import process from "process";
import path from 'path';

let token: string = '';

if (fs.existsSync(path.join(__dirname, '../config/secret.js'))) {
    token = require('../config/secret');
    if (!token) {
        console.error('config/secret.js empty.');
        process.exit(1);
    }
} else {
    console.error('config/secret.js not found.');
    process.exit(1);
}

let category = {
    text: '',
    voice: '',
    recruit: '',
    text_cp: '',
    voice_cp: ''
};

if (fs.existsSync(path.join(__dirname, '../config/category.js'))) {
    category = require('../config/category');
    if (!token) {
        console.error('config/category.js empty.');
        process.exit(1);
    }
} else {
    console.error('config/category.js not found.');
    process.exit(1);
}

export {
    category,
    token
}