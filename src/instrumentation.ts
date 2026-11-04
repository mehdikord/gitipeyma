import type { Instrumentation } from 'next';

/**
 * Every error the server hits while rendering a page, running an action or serving a route is appended to
 * storage/logs/errors.log (and printed to stderr) with the request it happened on. Production pages only show
 * the error's digest; this is where the message behind that digest is found, whatever runs the process.
 * The writers live in their own module so the Edge bundle (the proxy) never pulls in Node's fs.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { checkDatabase } = await import('./instrumentation.node');
  await checkDatabase();
}

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { logRequestError } = await import('./instrumentation.node');
  await logRequestError(error, request, context);
};
