const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const ProductTagModel = require('../ProductTag'); 
let sequelize = new Sequelize('sqlite::memory:', { logging: false });

describe('ProductTag Model', () => {
  let sequelize;
  let ProductTag;

  beforeAll(async () => {
    sequelize = new sequelize('sqlite::memory:', { logging: false });
    ProductTag = ProductTagModel.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'product', 
          key: 'id',
        },
      },
      tag_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'tag', 
          key: 'id',
        },
      }
    }, {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'product_tag',
    });

    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('has correct modelName', () => {
    console.log('ProductTag modelName:', ProductTag.modelName);
    expect(ProductTag.modelName).toBe('product_tag');
  });

  test('has correct fields', () => {
    console.log('ProductTag fields:', Object.keys(ProductTag.rawAttributes));
    expect(ProductTag.rawAttributes.product_id).toBeDefined();
    expect(ProductTag.rawAttributes.tag_id).toBeDefined();
  });
});

