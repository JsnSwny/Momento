module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comments", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      postId: {
          type: Sequelize.INTEGER
      },
      authorId: {
          type: Sequelize.INTEGER
      },
      text: {
          type: Sequelize.TEXT
      },
      dateCommented: {
          type: Sequelize.DATE
      }
    });
  
    return Comment;
};