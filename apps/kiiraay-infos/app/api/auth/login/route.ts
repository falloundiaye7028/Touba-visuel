import {cookies} from 'next/headers';
import {randomBytes,createHash} from 'node:crypto';
import {database} from '@/db';
import {COOKIE,sameOrigin} from '@/app/admin-auth';
import {verifyPassword} from '@/lib/password.mjs';
export async function POST(req:Request){
 if(!sameOrigin(req))return Response.json({error:'Origine non autorisée.'},{status:403});
 if(!process.env.DATABASE_URL||!process.env.ADMIN_PASSWORD_HASH)return Response.json({error:'La connexion administrateur n’est pas encore configurée.'},{status:503});
 try{const raw=await req.text();if(raw.length>1024)return Response.json({error:'Requête trop volumineuse.'},{status:413});const {password}=JSON.parse(raw);const sql=database();
 const bucket=Math.floor(Date.now()/900000);const attempts=await sql`INSERT INTO kiiraay_login_limits(bucket,attempts) VALUES(${bucket},1) ON CONFLICT(bucket) DO UPDATE SET attempts=kiiraay_login_limits.attempts+1 RETURNING attempts`;
 if(attempts[0].attempts>10)return Response.json({error:'Trop de tentatives. Réessayez dans 15 minutes.'},{status:429});
 if(!verifyPassword(password,process.env.ADMIN_PASSWORD_HASH))return Response.json({error:'Identifiants incorrects.'},{status:401});
 const token=randomBytes(32).toString('hex');await sql`INSERT INTO kiiraay_sessions(token_hash,expires) VALUES(${createHash('sha256').update(token).digest('hex')},now()+interval '12 hours')`;
 (await cookies()).set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:43200});
 return Response.json({ok:true});
 }catch{ return Response.json({error:'Connexion momentanément indisponible.'},{status:503});}
}
