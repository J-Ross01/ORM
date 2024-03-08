const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const ProductModel = require('../Product'); 

let sequelize = new Sequelize('sqlite::memory:', { logging: false });

describe('Product Model', () => {
  let Product;

  beforeAll(async () => {
    Product = ProductModel.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          isDecimal: true,
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        validate: {
          isNumeric: true,
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'category', 
          key: 'id',
        },
      },
    }, {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'product',
    });

    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('should have correct model name', () => {
    console.log('Product modelName:', Product.modelName);
    expect(Product.modelName).toBe('product');
  });

  test('should have the correct fields', () => {
    console.log('Product fields:', Object.keys(Product.rawAttributes));
    expect(Product.rawAttributes.product_name).toBeDefined();
    expect(Product.rawAttributes.price).toBeDefined();
    expect(Product.rawAttributes.stock).toBeDefined();
    expect(Product.rawAttributes.category_id).toBeDefined();
  });

  test('should validate price as decimal', async () => {
    await expect(Product.create({
      product_name: 'Test Product',
      price: 'not-a-decimal',
      stock: 10,
    })).rejects.toThrow();
  });

  test('should validate stock as numeric', async () => {
    await expect(Product.create({
      product_name: 'Test Product',
      price: 10.00,
      stock: 'not-a-number',
    })).rejects.toThrow();
  });

});
