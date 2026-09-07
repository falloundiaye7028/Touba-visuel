import {headers} from 'next/headers';
import {database} from '@/db/raw';
export async function GET(){
 try {
  const owner=(await headers()).get('oai-authenticated-user-id');
  if(!owner)return Response.json({error:'Connexion requise pour cet aperçu privé.'},{status:401});
  const result=await database().prepare("SELECT id,kind,data,created FROM records WHERE owner = ? AND kind IN ('activities','cells','articles') ORDER BY created DESC").bind(owner).all();
  const records=result.results.flatMap((row:any)=>{
   const data=JSON.parse(row.data);
   if(row.kind==='activities'||row.kind==='articles')return data.status==='Publié'?[{...row,data}]:[];
   return [{id:row.id,kind:'cells',created:row.created,data:{name:data.name,area:data.area}}];
  });
  return Response.json({records},{headers:{'Cache-Control':'no-store'}});
 }catch(error){console.error(error);return Response.json({error:'Les publications sont momentanément indisponibles. Réessayez.'},{status:503});}
}
