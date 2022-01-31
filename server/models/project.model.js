module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define("projects", {
      projectId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ownerId: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      }
    });
  
    return Project;
  };