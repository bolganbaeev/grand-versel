process.env.VERCEL = process.env.VERCEL ?? '1';
const { app } = await import('../server.js');

export default function handler(req: any, res: any) {
  return app(req, res);
}
