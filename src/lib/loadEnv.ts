import nextEnv from '@next/env';

/**
 * Reads .env for the CLI tools (Prisma, seeding, scripts) the same way `next start` reads it for the site.
 * Next expands `$VAR` in values and plain dotenv doesn't, so with any other reader a password containing `$`
 * would let the CLI connect while the site can't.
 */
export function loadEnv() {
  nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error: console.error });
}
