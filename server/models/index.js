const config = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,

        //This has to be here for some reason
        define: {
            timestamps: false
        },

        pool: {
          max: config.pool.max,
          min: config.pool.min,
          acquire: config.pool.acquire,
          idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.project = require("./project.model")(sequelize, Sequelize);
db.page = require("./page.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

//Connect the user table to the projects table (one to many). The user in this instance is the owner of the project
db.user.hasMany(db.project, { foreignKey: "projectId" });
db.project.belongsTo(db.user, { foreignKey: "projectId" });

//Connect the project table to the pages table (one to many)
db.project.hasMany(db.page, { foreignKey: "pageId" });
db.page.belongsTo(db.project, { foreignKey: "pageId" })

db.ROLES = ["user", "mod", "admin"]

module.exports = db;