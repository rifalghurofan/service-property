"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};
var DataTypes = require("sequelize/lib/data-types");

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync({ force: false }).then(() => {
    console.log("Yes, resync");
});

db.interfaceS = require("./interfaces")(sequelize, DataTypes);
db.kavlings = require("./kavlings")(sequelize, DataTypes);
db.live_previews = require("./live_previews")(sequelize, DataTypes);
db.properties = require("./properties")(sequelize, DataTypes);
db.siteplan = require("./siteplan")(sequelize, DataTypes);
db.type_houses = require("./type_houses")(sequelize, DataTypes);
db.specifications = require("./specifications")(sequelize, DataTypes);
db.unit_facilities = require("./unit_facilities")(sequelize, DataTypes);
db.near_facilities = require("./near_facilities")(sequelize, DataTypes);
db.furnitures = require("./furnitures")(sequelize, DataTypes);

// One to One, interface have one kavlings
db.interfaceS.hasOne(db.kavlings, { foreignKey: "interface_id" });
db.kavlings.belongsTo(db.interfaceS, {
    foreignKey: "interface_id",
});

// One to Many, property have many kavlings
db.properties.hasMany(db.kavlings, { foreignKey: "property_id" });
db.kavlings.belongsTo(db.properties, {
    foreignKey: "property_id",
});

// property has many spesifications
db.properties.hasMany(db.specifications, {
    foreignKey: "property_id",
    as: "specifications",
});

// property has many type_houses
db.properties.hasMany(db.type_houses, {
    foreignKey: "property_id",
    as: "type_houses",
});
db.type_houses.belongsTo(db.properties, {
    foreignKey: "property_id",
});

db.specifications.belongsTo(db.properties, {
    foreignKey: "property_id",
});

// One to Many, type house have many kavlings
db.type_houses.hasMany(db.kavlings, { foreignKey: "type_house_id" });
db.kavlings.belongsTo(db.type_houses, {
    foreignKey: "type_house_id",
});

// one to many, property have many near facilities
db.properties.hasMany(db.near_facilities, {
    foreignKey: "property_id",
    as: "near_facilities",
});
db.near_facilities.belongsTo(db.properties, {
    foreignKey: "property_id",
    as: "near_facilities",
});

// One to One, property have one siteplans
db.properties.hasOne(db.siteplan, {
    foreignKey: "property_id",
    as: "siteplan",
});
db.siteplan.belongsTo(db.properties, {
    foreignKey: "property_id",
    as: "Property_id",
});

// One to Many, property have many live previews
db.properties.hasMany(db.live_previews, {
    foreignKey: "property_id",
    as: "live_previews",
});
db.live_previews.belongsTo(db.properties, {
    foreignKey: "property_id",
    as: "Property_id",
});

// One to Many, live previews have many type house
db.live_previews.hasMany(db.type_houses, { foreignKey: "live_previews" });
db.type_houses.belongsTo(db.live_previews, {
    foreignKey: "live_previews",
});

// properties has many unit facilities
db.properties.hasMany(db.unit_facilities, {
    foreignKey: "property_id",
    as: "unit_facilities",
});
db.unit_facilities.belongsTo(db.properties, {
    foreignKey: "property_id",
    as: "Property_id",
});

module.exports = db;
