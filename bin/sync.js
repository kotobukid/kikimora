#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = __importDefault(require("../models"));
models_1.default.channel.sync({
    force: false,
    logging: console.log,
})
    .then(function () {
    console.log(models_1.default);
    // return models.Sequelize.close()
});
models_1.default.message_room.sync({
    force: false,
    logging: console.log,
})
    .then(function () {
    console.log(models_1.default);
    // return models.Sequelize.close()
});
models_1.default.summon_cache.sync({
    force: false,
    logging: console.log,
})
    .then(function () {
    console.log(models_1.default);
    // return models.Sequelize.close()
});
