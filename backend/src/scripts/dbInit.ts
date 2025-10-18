import { initializeDatabase } from '../db/sqlite';

(async () => {
  try {
    await initializeDatabase();
    // eslint-disable-next-line no-console
    console.log('Database initialized.');
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Database init failed:', err);
    process.exit(1);
  }
})();


