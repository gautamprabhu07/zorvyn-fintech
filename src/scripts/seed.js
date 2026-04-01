require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const FinancialRecord = require('../models/FinancialRecord');

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'Admin123',
    role: 'ADMIN',
  },
  {
    name: 'Analyst User',
    email: 'analyst@demo.com',
    password: 'Analyst123',
    role: 'ANALYST',
  },
  {
    name: 'Viewer User',
    email: 'viewer@demo.com',
    password: 'Viewer123',
    role: 'VIEWER',
  },
];

const seedFinancialRecords = [
  { amount: 50000, type: 'INCOME', category: 'Salary', date: '2025-01-05', note: 'January salary' },
  { amount: 2000, type: 'EXPENSE', category: 'Food', date: '2025-01-06', note: 'Dining out' },
  { amount: 3000, type: 'EXPENSE', category: 'Rent', date: '2025-01-10', note: 'Monthly rent' },
  { amount: 15000, type: 'INCOME', category: 'Freelance', date: '2025-02-02', note: 'Project payment' },
  { amount: 2500, type: 'EXPENSE', category: 'Groceries', date: '2025-02-05', note: 'Weekly groceries' },
  { amount: 1000, type: 'EXPENSE', category: 'Transport', date: '2025-02-08', note: 'Fuel' },
  { amount: 52000, type: 'INCOME', category: 'Salary', date: '2025-03-05', note: 'March salary' },
  { amount: 4000, type: 'EXPENSE', category: 'Shopping', date: '2025-03-07', note: 'Clothes' },
  { amount: 1200, type: 'EXPENSE', category: 'Food', date: '2025-03-09', note: 'Snacks' },
  { amount: 8000, type: 'INCOME', category: 'Bonus', date: '2025-03-15', note: 'Performance bonus' },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing users and financial records...');
    await Promise.all([User.deleteMany({}), FinancialRecord.deleteMany({})]);

    console.log('Inserting demo users...');
    const insertedUsers = await User.create(seedUsers);

    const adminUser = insertedUsers.find((user) => user.role === 'ADMIN');

    if (!adminUser) {
      throw new Error('Admin user was not created during seeding');
    }

    const recordsToInsert = seedFinancialRecords.map((record) => ({
      userId: adminUser._id,
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: new Date(record.date),
      note: record.note,
    }));

    console.log('Inserting demo financial records...');
    const insertedRecords = await FinancialRecord.insertMany(recordsToInsert);

    const totalIncome = insertedRecords
      .filter((record) => record.type === 'INCOME')
      .reduce((sum, record) => sum + record.amount, 0);

    const totalExpense = insertedRecords
      .filter((record) => record.type === 'EXPENSE')
      .reduce((sum, record) => sum + record.amount, 0);

    console.log('Seed completed successfully.');
    console.log(`Users created: ${insertedUsers.length}`);
    console.log(`Financial records created: ${insertedRecords.length}`);
    console.log(`Summary preview -> Income: ${totalIncome}, Expense: ${totalExpense}, Net: ${totalIncome - totalExpense}`);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit(process.exitCode || 0);
  }
};

seedData();
