import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminListAll, adminUpdate } from "@/lib/touba-infos-store";
import { ELECTIONS_2027_SERIES } from "@/lib/touba-infos-series-elections-2027";
import { MEDIA_URL } from "@/lib/touba-infos";

export const dynamic = "force-dynamic";

export async function GET(){
  const all=await adminListAll();
  const updated=[];
  for(let i=0;i<ELECTIONS_2027_SERIES.length;i++){
    const s=ELECTIONS_2027_SERIES[i];
    const a=all.find(x=>x.titre===s.titre);
    if(!a) continue;
    const imageUrl=`${MEDIA_URL}/api/touba-infos/elections-visual/${i+1}`;
    const u=await adminUpdate(a.id,{
      imageUrl,
      credit:"Touba Infos — Série spéciale Élections 2027",
      legende:s.titre,
      imageFocalX:50,
      imageFocalY:50,
    });
    if(u) updated.push({id:u.id,slug:u.slug,imageUrl:u.imageUrl});
  }
  revalidatePath("/touba-infos","layout");
  revalidatePath("/", "layout");
  return NextResponse.json({ok:true,count:updated.length,articles:updated});
}
