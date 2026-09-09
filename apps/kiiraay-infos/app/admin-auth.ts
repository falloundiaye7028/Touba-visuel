import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {createHash} from 'node:crypto';
import {database} from '@/db';
export const COOKIE='kiiraay_session';
export async function isAdmin(){const token=(await cookies()).get(COOKIE)?.value;if(!token||!/^[a-f0-9]{64}$/.test(token))return false;const sql=database();const rows=await sql`SELECT token_hash FROM kiiraay_sessions WHERE token_hash=${createHash('sha256').update(token).digest('hex')} AND expires>now()`;return rows.length===1;}
export async function requireAdmin(_returnTo='/gestion'){if(!await isAdmin())redirect('/connexion');}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');const target=new URL(request.url).origin;return origin===target;}
