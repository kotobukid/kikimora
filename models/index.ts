'use strict';

const fs = require('fs');
const path = require('path');
import Sequelize from "sequelize";
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db: Record<string, any> = {};

let sequelize: Sequelize.Sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize.Sequelize(config);
} else {
    sequelize = new Sequelize.Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter((file: string) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file: string) => {
        const _model = require(path.join(__dirname, file))
        db[_model.table_name] = sequelize.define(_model.table_name, _model.ModelSource);
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// module.exports = db;
export default db;