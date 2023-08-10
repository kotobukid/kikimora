#!/usr/bin/env node

'use strict';

import models from '../models'

models.channel!.sync({
    force: false,
    logging: console.log,
})
    .then(function (): void {
        console.log(models)
        // return models.Sequelize.close()
    });

models.message_room!.sync({
    force: false,
    logging: console.log,
})
    .then(function (): void {
        console.log(models)
        // return models.Sequelize.close()
    });

models.summon_cache!.sync({
    force: false,
    logging: console.log,
})
    .then(function (): void {
        console.log(models)
        // return models.Sequelize.close()
    });
