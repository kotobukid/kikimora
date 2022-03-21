#!/usr/bin/env node

'use strict';

import models from '../models'

models.channel!.sync({
    force: true,
    logging: console.log,
})
    .then(function () {
        console.log(models)
        // return models.Sequelize.close()
    });

models.message_room!.sync({
    force: true,
    logging: console.log,
})
    .then(function () {
        console.log(models)
        // return models.Sequelize.close()
    });

models.summon_cache!.sync({
    force: true,
    logging: console.log,
})
    .then(function () {
        console.log(models)
        // return models.Sequelize.close()
    });
