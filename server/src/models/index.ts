import { sequelize } from '../db/sequelize';
import { User } from './User';
import { Company } from './Company';
import { Product } from './Product';

// Associations: a company has many products; a product belongs to one company.
// Deleting a company cascades to its products to keep referential integrity.
Company.hasMany(Product, {
  foreignKey: 'companyId',
  as: 'products',
  onDelete: 'CASCADE',
});
Product.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
});

export { sequelize, User, Company, Product };
