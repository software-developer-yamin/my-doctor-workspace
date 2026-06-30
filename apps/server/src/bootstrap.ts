import { logger } from './utils/logger.js';

export async function runBootstrap() {
  logger.info('[BOOTSTRAP] Skipping BD location seed — run seed-bdlocations.ts for initial data load');
}
