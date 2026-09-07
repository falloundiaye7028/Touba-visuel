import {headers} from 'next/headers';
import {database} from '@/db/raw';
import {z} from 'zod';
const short=z.string().trim().min(1).max(160), optional=z.string().trim().max(500).default('');
const day=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s);
const media=z.string().max(2000).refine(s=>{if(!s)return true;try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}}).default('');
const schemas={
 articles:z.object({name:short,date:day,category:z.enum(['National','Régions','Diaspora','Touba','Communiqués']),place:optional,description:z.string().trim().min(1).max(30000),summary:z.string().trim().max(400),author:short,status:z.enum(['Brouillon','Publié']),featured:z.boolean().default(false),image:media,video:media}),
 cells:z.object({name:short,area:short,leader:optional}),
 members:z.object({name:short,phone:optional,cell:optional,role:optional,status:z.enum(['En attente','Active','Suspendue']),expiry:day,consent:z.literal(true)}),
 activities:z.object({name:short,date:day,place:short,type:z.enum(['Réunion','Activité','Communiqué']),status:z.enum(['Brouillon','Publié']),description:z.string().trim().max(5000)}),
 contributions:z.object({member:short,amount:z.number().int().positive().max(100000000),date:day,method:z.enum(['Espèces','Virement','Mobile Money']),period:short})
};
export async function GET(){try{const uid=(await headers()).get('oai-authenticated-user-id');if(!uid)return Response.json({error:'Connexion requise.'},{status:401});const result=await database().prepare('SELECT * FROM records WHERE owner = ? ORDER BY created DESC').bind(uid).all();return Response.json({records:result.results.map((r:any)=>({...r,data:JSON.parse(r.data),owner:undefined}))},{headers:{'Cache-Control':'no-store'}});}catch(e){console.error(e);return Response.json({error:'Les données sont indisponibles. Réessayez.'},{status:503});}}
export async function POST(req:Request){try{
 const uid=(await headers()).get('oai-authenticated-user-id');if(!uid)return Response.json({error:'Connexion requise.'},{status:401});
 if(req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'Origine non autorisée.'},{status:403});
 const raw=await req.text();if(raw.length>45000)return Response.json({error:'Formulaire trop volumineux.'},{status:413});
 const body=JSON.parse(raw);const kind=body.kind as keyof typeof schemas;if(!schemas[kind])return Response.json({error:'Type invalide.'},{status:400});
 const parsed=schemas[kind].safeParse(body.data);if(!parsed.success)return Response.json({error:'Vérifiez les champs obligatoires et les dates.'},{status:400});
 const data:any=parsed.data,db=database();const ref=kind==='members'?data.cell:kind==='contributions'?data.member:null;
 if(ref&&!await db.prepare('SELECT id FROM records WHERE id = ? AND owner = ? AND kind = ?').bind(ref,uid,kind==='members'?'cells':'members').first())return Response.json({error:'Le membre ou la cellule est introuvable.'},{status:400});
 const id=body.id||crypto.randomUUID();if(body.id){const result=await db.prepare('UPDATE records SET data = ? WHERE id = ? AND owner = ? AND kind = ?').bind(JSON.stringify(data),id,uid,kind).run();if(!result.meta.changes)return Response.json({error:'Élément introuvable.'},{status:404});}
 else await db.prepare('INSERT INTO records (id,owner,kind,data,created) VALUES (?,?,?,?,?)').bind(id,uid,kind,JSON.stringify(data),new Date().toISOString()).run();
 return Response.json({id});
 }catch(e){console.error(e);return Response.json({error:'Enregistrement impossible. Vos saisies ont été conservées.'},{status:500});}}
