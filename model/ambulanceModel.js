

module.exports = (sequelize, DataTypes, bcrypt, crypto) => {
    const User = sequelize.define("user", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
  
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.ENUM("patient", "donor", "bloodBank", "admin"),
        defaultValue: "patient",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 8,
        },
      },
  
      phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bloodGroup: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      localLevel: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      donatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      availiabilityStatus: {
        // type: DataTypes.ENUM("yes", "no"),
        type: DataTypes.STRING,
        defaultValue: "available",
      },
  
      passwordResetToken: DataTypes.STRING,
      passwordResetTokenExpiresIn: DataTypes.DATE,
    });
  

    return User;
  };
  