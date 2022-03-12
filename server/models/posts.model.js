module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("posts", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
          type: Sequelize.INTEGER
      },
      title: {
          type: Sequelize.STRING
      },
      description: {
          type: Sequelize.TEXT
      },
      imageURL: {
          type: Sequelize.STRING
      },
      views: {
          type: Sequelize.INTEGER
      },
      collaborators: {
          type: Sequelize.INTEGER
      },
      datePosted: {
          type: Sequelize.DATE
      }
    });
  
    return Post;
};