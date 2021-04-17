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