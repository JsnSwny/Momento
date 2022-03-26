module.exports = (sequelize, Sequelize) => {
    const ProjectRole = sequelize.define("projectRoles", {
      projectId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      userId: {
          type: Sequelize.INTEGER,
          primaryKey: true
      },
      roleName: {
        type: Sequelize.STRING
      }
    });
  
    return ProjectRole;
  };