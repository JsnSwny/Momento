module.exports = (sequelize, Sequelize) => {
    const Page = sequelize.define("pages", {
      pageId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      projectId: {
        type: Sequelize.INTEGER
      },
      pageNumber: {
        type: Sequelize.STRING
      },
      pageData: {
        type: Sequelize.STRING
      }
    });
  
    return Page;
  };