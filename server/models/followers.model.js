module.exports = (sequelize, Sequelize) => {
    const Followers = sequelize.define("followers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      userId1: {
        type: Sequelize.INTEGER
      },
      userId2: {
        type: Sequelize.INTEGER
      }
    });
  
    return Followers;
  };