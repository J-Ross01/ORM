const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const TagModel = require('../Tag'); 
let sequelize = new Sequelize('sqlite::memory:', { logging: false });

describe('Tag Model', () => {
    let sequelize;
    let Tag;
  
    beforeAll(async () => {

      sequelize = new Sequelize('sqlite::memory:', { logging: false });
      Tag = TagModel.init({

        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        tag_name: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      }, {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'tag',
      });
  
      await sequelize.sync();
    });
  
    afterAll(async () => {
      await sequelize.close();
    });
  
    test('has correct modelName', () => {
      expect(Tag.modelName).toBe('tag');
    });
  
    test('has correct fields', () => {
      expect(Tag.rawAttributes.tag_name).toBeDefined();
    });
  
  });