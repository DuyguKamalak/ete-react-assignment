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
    { name: 'Atlas Logistics', legalNumber: 'TR-1001', incorporationCountry: 'Türkiye', website: 'https://atlas-logistics.example.com' },
    { name: 'Nordic Foods', legalNumber: 'SE-2042', incorporationCountry: 'Sweden', website: 'https://nordicfoods.example.com' },
    { name: 'Aegean Textiles', legalNumber: 'TR-3087', incorporationCountry: 'Türkiye', website: 'https://aegean-textiles.example.com' },
    { name: 'Rhein Components', legalNumber: 'DE-5523', incorporationCountry: 'Germany', website: 'https://rhein-components.example.com' },
    { name: 'Pacific Devices', legalNumber: 'US-9001', incorporationCountry: 'United States', website: 'https://pacific-devices.example.com' },
  ]);

  const byName = (name: string) => companies.find((c) => c.name === name)!.id;

  await Product.bulkCreate([
    { name: 'Steel Pallet', category: 'Logistics', amount: 1200, amountUnit: 'pcs', companyId: byName('Atlas Logistics') },
    { name: 'Cargo Strap', category: 'Logistics', amount: 5000, amountUnit: 'pcs', companyId: byName('Atlas Logistics') },
    { name: 'Organic Flour', category: 'Food', amount: 800, amountUnit: 'kg', companyId: byName('Nordic Foods') },
    { name: 'Lingonberry Jam', category: 'Food', amount: 350, amountUnit: 'jar', companyId: byName('Nordic Foods') },
    { name: 'Cotton Fabric', category: 'Textile', amount: 2400, amountUnit: 'm', companyId: byName('Aegean Textiles') },
    { name: 'Linen Roll', category: 'Textile', amount: 900, amountUnit: 'm', companyId: byName('Aegean Textiles') },
    { name: 'Hydraulic Valve', category: 'Industrial', amount: 150, amountUnit: 'pcs', companyId: byName('Rhein Components') },
    { name: 'Pressure Sensor', category: 'Electronics', amount: 640, amountUnit: 'pcs', companyId: byName('Pacific Devices') },
    { name: 'Microcontroller', category: 'Electronics', amount: 3200, amountUnit: 'pcs', companyId: byName('Pacific Devices') },
  ]);

  console.log('Seed completed: user "admin" / password "admin123", 5 companies, 9 products.');
  await sequelize.close();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
