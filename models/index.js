const sequelize = require('../config/database');
const { DataTypes, Model } = require('sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true  
    }
  },
  password: DataTypes.STRING,
  role: DataTypes.ENUM('user', 'admin')
}, {
  hooks: {
    beforeCreate: (user) => {
      if (user.name.length <= 2) {
        throw new Error('Name must be greater than 2 characters');
      }
    }
  }
});

User.prototype.checkPasswordLength = function() {
  if (this.password.length <= 6) {
    throw new Error('Password must be greater than 6 characters');
  }
};

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  paranoid: true 
});

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: DataTypes.TEXT,
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: Post,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Post,
  Comment,
  sequelize
};
