const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const { Product, Category, Tag, ProductTag } = require('../index');
let sequelize = new Sequelize('sqlite::memory:', { logging: false });

describe('Model Associations', () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    Product.init({
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
      }, { sequelize });

    Category.init( {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        category_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      }, { sequelize });

    Tag.init( {
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
      }, { sequelize });

    ProductTag.init({
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
      }, { sequelize });

    Product.belongsTo(Category, { foreignKey: 'category_id' });
    Category.hasMany(Product, { foreignKey: 'category_id' });
    Product.belongsToMany(Tag, { through: ProductTag, foreignKey: 'product_id' });
    Tag.belongsToMany(Product, { through: ProductTag, foreignKey: 'tag_id' });

    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('products belong to category', () => {
    expect(Product.associations.category).toBeDefined();
  });

  test('categories have many products', () => {
    expect(Category.associations.products).toBeDefined();
  });

  test('products belong to many tags', () => {
    expect(Product.associations.tags).toBeDefined();
  });

  test('tags belong to many products', () => {
    expect(Tag.associations.products).toBeDefined();
  });

});

