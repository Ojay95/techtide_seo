// Safe fetching helpers for the audit tool. Blocks private addresses, limits redirects, time and size.
import dns from 'node:dns/promises';
import net from 'node:net';

export const UA = 'TechTideSEOAuditBot/1.0 (+https://techtideseo.com/seo-audit-tool/)';

export function normalizeUrl(input) {
  let s = String(input || '').trim();
  if (!s) throw new Error('Enter a website address.');
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  let u;
  try { u = new URL(s); } catch { throw new Error('That does not look like a valid website address.'); }
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('Only http and https addresses are supported.');
  if (u.username || u.password) throw new Error('Addresses with logins are not supported.');
  if (u.port && !['80', '443'].includes(u.port)) throw new Error('Only standard web ports are supported.');
  u.hash = '';
  return u;
}

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || a === 0 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
  }
  const v = ip.toLowerCase();
  if (v === '::1' || v === '::') return true;
  if (v.startsWith('::ffff:')) return isPrivateIp(v.slice(7));
  return /^(fc|fd|fe8|fe9|fea|feb)/.test(v);
}

export async function assertPublic(hostname) {
  const host = hostname.replace(/^\[|\]$/g, '');
  const deny = () => { throw new Error('That address is not allowed.'); };
  if (net.isIP(host)) { if (isPrivateIp(host)) deny(); return; }
  const lower = host.toLowerCase();
  if (lower === 'localhost' || lower.endsWith('.local') || lower.endsWith('.internal') || !lower.includes('.')) deny();
  let recs;
  try { recs = await dns.lookup(host, { all: true }); } catch { throw new Error('We could not find that website. Check the spelling.'); }
  if (!recs.length || recs.some((r) => isPrivateIp(r.address))) deny();
}

export async function fetchPage(startUrl, { maxRedirects = 5, timeoutMs = 8000, maxBytes = 1500000, totalMs = 12000 } = {}) {
  let url = new URL(startUrl);
  const chain = [];
  const t0 = Date.now();
  for (let i = 0; i <= maxRedirects; i++) {
    await assertPublic(url.hostname);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    let res;
    try {
      res = await fetch(url, { redirect: 'manual', signal: ctrl.signal, headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,*/*;q=0.8', 'accept-language': 'en' } });
    } catch (e) {
      clearTimeout(timer);
      throw new Error(e && e.name === 'AbortError' ? 'The website took too long to respond.' : 'We could not connect to that website.');
    }
    clearTimeout(timer);
    const loc = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && loc) {
      chain.push({ url: url.href, status: res.status });
      url = new URL(loc, url);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('The website redirects somewhere we cannot check.');
      try { await res.body?.cancel(); } catch {}
      continue;
    }
    const chunks = [];
    let received = 0;
    const reader = res.body?.getReader();
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.length;
        chunks.push(value);
        if (received > maxBytes || Date.now() - t0 > totalMs) { try { await reader.cancel(); } catch {} break; }
      }
    }
    const body = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf8');
    return { finalUrl: url, status: res.status, headers: res.headers, body, bytes: received, ms: Date.now() - t0, chain };
  }
  throw new Error('The website redirects too many times.');
}

const hits = new Map();
export function rateLimited(req, limit = 15, windowMs = 3600000) {
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || (req.socket && req.socket.remoteAddress) || 'unknown';
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > limit;
}

export const send = (res, code, obj) => {
  res.statusCode = code;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(obj));
};
