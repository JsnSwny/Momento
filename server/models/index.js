const config = require("../config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB_NAME,
    config.DB_USER,
    config.DB_PASSWORD,
    {
        host: config.DB_HOST,
        dialect: config.DB_DIALECT,

        //This has to be here for some reason
        define: {
            timestamps: false
        },

        pool: {
          max: config.DB_POOL.max,
          min: config.DB_POOL.min,
          acquire: config.DB_POOL.acquire,
          idle: config.DB_POOL.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.refreshToken = require("./refreshToken.model")(sequelize, Sequelize);
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

//Connect the refreshToken table to the user table (one to one)
db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});
db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});

//Connect the user table to the projects table (one to many). The user in this instance is the owner of the project
db.user.hasMany(db.project, { foreignKey: "projectId" });
db.project.belongsTo(db.user, { foreignKey: "projectId" });

//Connect the project table to the pages table (one to many)
db.project.hasMany(db.page, { foreignKey: "pageId" });
db.page.belongsTo(db.project, { foreignKey: "pageId" });

db.ROLES = ["user", "mod", "admin"];

//Posts, comments and likes
db.post = require("./posts.model")(sequelize, Sequelize);
db.comment = require("./comments.model")(sequelize, Sequelize);
db.like = require("./likes.model")(sequelize, Sequelize);

//Define posts <-> users relationship
db.user.hasMany(db.post, {
  foreignKey: 'userId', targetKey: 'id'
});
db.post.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});

//Define comments <-> posts relationship
db.post.hasMany(db.comment, {
  foreignKey: 'postId', targetKey: 'id'
});
db.comment.belongsTo(db.post, {
  foreignKey: 'postId', targetKey: 'id'
});

//Define comments <-> users relationship
db.user.hasMany(db.comment, {
  foreignKey: 'authorId', targetKey: 'id'
});
db.comment.belongsTo(db.user, {
  foreignKey: 'authorId', targetKey: 'id'
});

//Define likes <-> posts relationship
db.post.hasMany(db.like, {
  foreignKey: 'postId', targetKey: 'id'
});
db.like.belongsTo(db.post, {
  foreignKey: 'postId', targetKey: 'id'
});

//Define likes <-> users relationship
db.user.hasMany(db.like, {
  foreignKey: 'authorId', targetKey: 'id'
});
db.like.belongsTo(db.user, {
  foreignKey: 'authorId', targetKey: 'id'
});

// Followers table
db.followers = require("./followers.model")(sequelize, Sequelize);
db.followers.belongsTo(db.user, {foreignKey: 'userId1'});
db.followers.belongsTo(db.user, {foreignKey: 'userId2'});

module.exports = db;