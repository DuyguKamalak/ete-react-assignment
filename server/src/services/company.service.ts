import { Company } from '../models';
import { HttpError } from '../middleware/errorHandler';
import type { CompanyInput } from '../validators/schemas';

function normalize(input: CompanyInput) {
  return {
    name: input.name,
    legalNumber: input.legalNumber,
    incorporationCountry: input.incorporationCountry,
    website: input.website ? input.website : null,
  };
}

export const companyService = {
  list() {
    return Company.findAll({ order: [['createdAt', 'DESC']] });
  },

  async getById(id: number) {
    const company = await Company.findByPk(id);
    if (!company) {
      throw new HttpError(404, 'Company not found');
    }
    return company;
  },

  create(input: CompanyInput) {
    return Company.create(normalize(input));
  },

  async update(id: number, input: CompanyInput) {
    const company = await this.getById(id);
    return company.update(normalize(input));
  },

  async remove(id: number) {
    const company = await this.getById(id);
    await company.destroy();
  },
};
