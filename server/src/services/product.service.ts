import { Product, Company } from '../models';
import { HttpError } from '../middleware/errorHandler';
import type { ProductInput } from '../validators/schemas';

const includeCompany = {
  model: Company,
  as: 'company',
  attributes: ['id', 'name'],
};

export const productService = {
  list() {
    return Product.findAll({
      include: [includeCompany],
      order: [['createdAt', 'DESC']],
    });
  },

  async getById(id: number) {
    const product = await Product.findByPk(id, { include: [includeCompany] });
    if (!product) {
      throw new HttpError(404, 'Product not found');
    }
    return product;
  },

  async assertCompanyExists(companyId: number) {
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw new HttpError(400, 'Selected company does not exist');
    }
  },

  async create(input: ProductInput) {
    await this.assertCompanyExists(input.companyId);
    const product = await Product.create(input);
    return this.getById(product.id);
  },

  async update(id: number, input: ProductInput) {
    const product = await this.getById(id);
    await this.assertCompanyExists(input.companyId);
    await product.update(input);
    return this.getById(id);
  },

  async remove(id: number) {
    const product = await this.getById(id);
    await product.destroy();
  },
};
