import bcrypt from 'bcryptjs';
import { sequelize, User, Company, Product } from '../models';

/**
 * Seeds the database with a demo user and sample companies/products so the
 * application can be explored immediately after setup.
 *
 * Run with: npm run seed
 */
async function seed() {
  await sequelize.authenticate();
  // Recreate the schema from scratch for a clean, repeatable seed.
  await sequelize.sync({ force: true });

  const passwordHash = await bcrypt.hash('admin123', 10);
  await User.create({ username: 'admin', passwordHash });

  const companies = await Company.bulkCreate([
    { name: 'ETE Technology', legalNumber: 'TR-2022-ETE', incorporationCountry: 'Türkiye', website: 'https://etetechnology.com' },
    { name: 'Aegean Free Zone Tech', legalNumber: 'TR-3087', incorporationCountry: 'Türkiye', website: 'https://aegean-fz-tech.example.com' },
    { name: 'Nordic Defense Systems', legalNumber: 'SE-2042', incorporationCountry: 'Sweden', website: 'https://nordic-defense.example.com' },
    { name: 'Rhein Simulation GmbH', legalNumber: 'DE-5523', incorporationCountry: 'Germany', website: 'https://rhein-sim.example.com' },
    { name: 'Pacific ISR Labs', legalNumber: 'US-9001', incorporationCountry: 'United States', website: 'https://pacific-isr.example.com' },
  ]);

  const byName = (name: string) => companies.find((c) => c.name === name)!.id;

  await Product.bulkCreate([
    // ETE Technology's real product portfolio
    { name: 'NGINR', category: 'AI & Data Fusion', amount: 12, amountUnit: 'license', companyId: byName('ETE Technology') },
    { name: 'HYMOTS', category: 'Simulation', amount: 8, amountUnit: 'license', companyId: byName('ETE Technology') },
    { name: 'ETECUBE', category: 'Training & Evaluation', amount: 25, amountUnit: 'license', companyId: byName('ETE Technology') },
    { name: 'ARTS', category: 'AI & Data Fusion', amount: 15, amountUnit: 'license', companyId: byName('ETE Technology') },
    // Sample data for other companies to populate charts and filters
    { name: 'Sensor Gateway', category: 'ISR', amount: 40, amountUnit: 'unit', companyId: byName('Aegean Free Zone Tech') },
    { name: 'Edge Compute Node', category: 'Cyber Security', amount: 60, amountUnit: 'unit', companyId: byName('Aegean Free Zone Tech') },
    { name: 'Tactical Radio Sim', category: 'Simulation', amount: 30, amountUnit: 'license', companyId: byName('Nordic Defense Systems') },
    { name: 'Flight Trainer Module', category: 'Training & Evaluation', amount: 6, amountUnit: 'module', companyId: byName('Rhein Simulation GmbH') },
    { name: 'MASINT Processor', category: 'ISR', amount: 10, amountUnit: 'license', companyId: byName('Pacific ISR Labs') },
    { name: 'OSINT Collector', category: 'ISR', amount: 18, amountUnit: 'license', companyId: byName('Pacific ISR Labs') },
  ]);

  console.log('Seed completed: user "admin" / password "admin123", 5 companies, 10 products.');
  await sequelize.close();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
