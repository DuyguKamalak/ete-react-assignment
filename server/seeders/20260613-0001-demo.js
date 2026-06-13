'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const passwordHash = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('users', [
      { username: 'admin', passwordHash, createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('companies', [
      { name: 'ETE Technology', legalNumber: 'TR-2022-ETE', incorporationCountry: 'Türkiye', website: 'https://etetechnology.com', createdAt: now, updatedAt: now },
      { name: 'Aegean Free Zone Tech', legalNumber: 'TR-3087', incorporationCountry: 'Türkiye', website: 'https://aegean-fz-tech.example.com', createdAt: now, updatedAt: now },
      { name: 'Nordic Defense Systems', legalNumber: 'SE-2042', incorporationCountry: 'Sweden', website: 'https://nordic-defense.example.com', createdAt: now, updatedAt: now },
      { name: 'Rhein Simulation GmbH', legalNumber: 'DE-5523', incorporationCountry: 'Germany', website: 'https://rhein-sim.example.com', createdAt: now, updatedAt: now },
      { name: 'Pacific ISR Labs', legalNumber: 'US-9001', incorporationCountry: 'United States', website: 'https://pacific-isr.example.com', createdAt: now, updatedAt: now },
    ]);

    // Resolve generated company ids so products reference the right rows.
    const [companies] = await queryInterface.sequelize.query(
      'SELECT id, name FROM companies;'
    );
    const idOf = (name) => companies.find((c) => c.name === name).id;

    await queryInterface.bulkInsert('products', [
      { name: 'NGINR', category: 'AI & Data Fusion', amount: 12, amountUnit: 'license', companyId: idOf('ETE Technology'), createdAt: now, updatedAt: now },
      { name: 'HYMOTS', category: 'Simulation', amount: 8, amountUnit: 'license', companyId: idOf('ETE Technology'), createdAt: now, updatedAt: now },
      { name: 'ETECUBE', category: 'Training & Evaluation', amount: 25, amountUnit: 'license', companyId: idOf('ETE Technology'), createdAt: now, updatedAt: now },
      { name: 'ARTS', category: 'AI & Data Fusion', amount: 15, amountUnit: 'license', companyId: idOf('ETE Technology'), createdAt: now, updatedAt: now },
      { name: 'Sensor Gateway', category: 'ISR', amount: 40, amountUnit: 'unit', companyId: idOf('Aegean Free Zone Tech'), createdAt: now, updatedAt: now },
      { name: 'Edge Compute Node', category: 'Cyber Security', amount: 60, amountUnit: 'unit', companyId: idOf('Aegean Free Zone Tech'), createdAt: now, updatedAt: now },
      { name: 'Tactical Radio Sim', category: 'Simulation', amount: 30, amountUnit: 'license', companyId: idOf('Nordic Defense Systems'), createdAt: now, updatedAt: now },
      { name: 'Flight Trainer Module', category: 'Training & Evaluation', amount: 6, amountUnit: 'module', companyId: idOf('Rhein Simulation GmbH'), createdAt: now, updatedAt: now },
      { name: 'MASINT Processor', category: 'ISR', amount: 10, amountUnit: 'license', companyId: idOf('Pacific ISR Labs'), createdAt: now, updatedAt: now },
      { name: 'OSINT Collector', category: 'ISR', amount: 18, amountUnit: 'license', companyId: idOf('Pacific ISR Labs'), createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('companies', null, {});
    await queryInterface.bulkDelete('users', { username: 'admin' }, {});
  },
};
