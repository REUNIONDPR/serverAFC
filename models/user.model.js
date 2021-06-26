module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        idgsai:{
            type: Sequelize.STRING(8)
        },
        nom: {
          type: Sequelize.STRING
        },
        prenom: {
          type: Sequelize.STRING
        },
        fonction: {
          type: Sequelize.STRING
        }
    });

    return User;
}