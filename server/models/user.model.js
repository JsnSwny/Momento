module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      emailAddress: {
        type: Sequelize.STRING
      },
      passwordHash: {
        type: Sequelize.STRING
      }
    });
  
    return User;
  };