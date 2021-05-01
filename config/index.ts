import fs from "fs";
import process from "process";
import path from 'path';
let token: string = '';

if (fs.existsSync(path.join(__dirname, './secret.js'))) {
    token = require('./secret');
    if (!token) {
        console.error('secret.js empty.');
        process.exit(1);
    }
} else {
    console.error('./secret.js not found.');
    process.exit(1);
}

let category = {
    text: '',
    voice: '',
    recruit: '',
    text_cp: '',
    voice_cp: ''
};

if (fs.existsSync(path.join(__dirname, './category.js'))) {
    category = require('./category');
    if (!token) {
        console.error('category.js empty.');
        process.exit(1);
    }
} else {
    console.error('./category.js not found.');
    process.exit(1);
}

export {
    category,
    token
}