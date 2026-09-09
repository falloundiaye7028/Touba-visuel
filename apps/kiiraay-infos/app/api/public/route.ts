import {database} from '@/db';
export async function GET(){
 if(!process.env.DATABASE_URL)return Response.json({records:[],configured:false},{headers:{'Cache-Control':'no-store'}});
 try{const sql=database();const records=await sql`SELECT id,kind,data,created FROM kiiraay_records WHERE kind IN ('articles','activities') AND data->>'status'='Publié' ORDER BY created DESC`;
 return Response.json({records,configured:true},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Les publications sont momentanément indisponibles.'},{status:503});}
}
