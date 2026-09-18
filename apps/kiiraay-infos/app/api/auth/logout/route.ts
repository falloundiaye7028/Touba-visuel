import {cookies} from 'next/headers';
import {createHash} from 'node:crypto';
import {database} from '@/db';
import {COOKIE,sameOrigin} from '@/app/admin-auth';
export async function POST(req:Request){if(!sameOrigin(req))return new Response(null,{status:403});const c=await cookies();const token=c.get(COOKIE)?.value;if(token){const sql=database();await sql`DELETE FROM kiiraay_sessions WHERE token_hash=${createHash('sha256').update(token).digest('hex')}`;}c.delete(COOKIE);return Response.redirect(new URL('/connexion',req.url),303);}
