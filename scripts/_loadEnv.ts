/* Loads .env.local then .env (in that order) at the top of any
   build/migration script. Imported for side-effects only. */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';

const candidates = ['.env.local', '.env'];
for (const file of candidates) {
  const path = resolve(process.cwd(), file);
  if (existsSync(path)) config({ path });
}
