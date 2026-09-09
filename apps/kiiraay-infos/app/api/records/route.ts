import {database} from '@/db';
import {isAdmin,sameOrigin} from '@/app/admin-auth';
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

export async function GET(){try{if(!await isAdmin())return Response.json({error:'Connexion requise.'},{status:401});const sql=database();const records=await sql`SELECT id,kind,data,created FROM kiiraay_records ORDER BY created DESC`;return Response.json({records},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Les données sont momentanément indisponibles.'},{status:503});}}
export async function POST(req:Request){
 if(!sameOrigin(req))return Response.json({error:'Origine non autorisée.'},{status:403});
 try{if(!await isAdmin())return Response.json({error:'Connexion requise.'},{status:401});const raw=await req.text();if(raw.length>45000)return Response.json({error:'Formulaire trop volumineux.'},{status:413});const body=JSON.parse(raw);const kind=body.kind as keyof typeof schemas;if(!Object.hasOwn(schemas,kind))return Response.json({error:'Type invalide.'},{status:400});const parsed=schemas[kind].safeParse(body.data);if(!parsed.success)return Response.json({error:'Vérifiez les champs obligatoires.'},{status:400});const data:any=parsed.data,sql=database();
 const ref=kind==='members'?data.cell:kind==='contributions'?data.member:null;
 if(ref){if(!z.string().uuid().safeParse(ref).success)return Response.json({error:'Référence invalide.'},{status:400});const target=kind==='members'?'cells':'members';const found=await sql`SELECT id FROM kiiraay_records WHERE id=${ref} AND kind=${target}`;if(!found.length)return Response.json({error:'Membre ou cellule introuvable.'},{status:400});}
 const id=body.id||crypto.randomUUID();if(!z.string().uuid().safeParse(id).success)return Response.json({error:'Identifiant invalide.'},{status:400});
 if(body.id){const updated=await sql`UPDATE kiiraay_records SET data=${JSON.stringify(data)}::jsonb WHERE id=${id} AND kind=${kind} RETURNING id`;if(!updated.length)return Response.json({error:'Élément introuvable.'},{status:404});}
 else await sql`INSERT INTO kiiraay_records(id,kind,data) VALUES(${id},${kind},${JSON.stringify(data)}::jsonb)`;
 return Response.json({id});
 }catch{return Response.json({error:'Enregistrement impossible. Vos saisies sont conservées.'},{status:503});}
}
