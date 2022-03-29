module.exports = (sequelize, Sequelize) => {
    const postImage = sequelize.define("postImages", {
        imageId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        postId: {
            type: Sequelize.INTEGER
        },
        imageNumber: {
            type: Sequelize.INTEGER
        },
        imageURL: {
            type: Sequelize.STRING
        }
    });
  
    return postImage;
};