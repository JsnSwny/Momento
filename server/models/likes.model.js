module.exports = (sequelize, Sequelize) => {
    const Like = sequelize.define("likes", {
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
        dateLiked: {
            type: Sequelize.DATE
        }
    });
  
    return Like;
};