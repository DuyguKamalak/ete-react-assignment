import { fn, col } from 'sequelize';
import { Company, Product } from '../models';

export const statsService = {
  async getDashboard() {
    const [
      totalCompanies,
      totalProducts,
      latestCompanies,
      productsByCategory,
      companiesByCountry,
    ] = await Promise.all([
      Company.count(),
      Product.count(),
      Company.findAll({
        order: [['createdAt', 'DESC']],
        limit: 3,
      }),
      Product.findAll({
        attributes: ['category', [fn('COUNT', col('id')), 'count']],
        group: ['category'],
        order: [[fn('COUNT', col('id')), 'DESC']],
        raw: true,
      }),
      Company.findAll({
        attributes: ['incorporationCountry', [fn('COUNT', col('id')), 'count']],
        group: ['incorporationCountry'],
        order: [[fn('COUNT', col('id')), 'DESC']],
        raw: true,
      }),
    ]);

    return {
      totalCompanies,
      totalProducts,
      distinctCategories: productsByCategory.length,
      distinctCountries: companiesByCountry.length,
      latestCompanies,
      productsByCategory: productsByCategory.map((row: any) => ({
        category: row.category,
        count: Number(row.count),
      })),
      companiesByCountry: companiesByCountry.map((row: any) => ({
        country: row.incorporationCountry,
        count: Number(row.count),
      })),
    };
  },
};
