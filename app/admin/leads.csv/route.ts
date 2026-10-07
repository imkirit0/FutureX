import { timingSafeEqual } from 'node:crypto';
import { LEAD_COLUMNS, listLeads } from '@/lib/db';

// Browser shows a login prompt (HTTP Basic Auth). Any username, password = ADMIN_PASSWORD.
function authorized(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  const header = req.headers.get('authorization') ?? '';
  if (!expected || !header.startsWith('Basic ')) return false;
  const password = Buffer.from(header.slice(6), 'base64').toString().split(':').slice(1).join(':');
  const a = Buffer.from(password), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const cell = (v: unknown) => {
  const s = Array.isArray(v) ? v.join('; ') : v instanceof Date ? v.toISOString() : String(v ?? '');
  // Quote, and neutralise spreadsheet formula injection.
  // A phone number like "+91 98765 43210" is safe and stays as-is.
  const risky = /^[=+\-@]/.test(s) && !/^\+[\d\s-]+$/.test(s);
  return `"${(risky ? `'${s}` : s).replace(/"/g, '""')}"`;
};

export async function GET(req: Request) {
  if (!authorized(req)) {
    return new Response('Authentication required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="FutureX leads"' } });
  }
  const rows = await listLeads();
  const csv = [LEAD_COLUMNS.join(','), ...rows.map(r => LEAD_COLUMNS.map(c => cell(r[c])).join(','))].join('\n');
  return new Response(csv, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="futurex-leads.csv"', 'Cache-Control': 'no-store' },
  });
}
