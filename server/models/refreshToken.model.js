const config = require("../config");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("refreshToken", {
        userId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        token: {
            type: Sequelize.STRING
        },
        expiryDate: {
            type: Sequelize.DATE
        }
    });

    RefreshToken.createToken = async function (user) {
        let expiredAt = new Date();
        expiredAt.setTime(expiredAt.getTime() + (config.JWT_REFRESH_EXPIRATION * 1000 ));
        let token = uuidv4();
        await this.destroy({
            where: {
                userId: user.id
            }
        })
        let refreshToken = await this.create({
            token: token,
            userId: user.id,
            expiryDate: expiredAt.getTime()
        });
        return refreshToken.token;
    };

    RefreshToken.verifyRefreshToken = (token) => {
        return token.expiryDate.getTime() < new Date().getTime();
    };

    return RefreshToken;
};