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
        userId: {
            type: Sequelize.INTEGER
        }
    });
  
    return Like;
};