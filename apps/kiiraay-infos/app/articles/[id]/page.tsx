import {requireChatGPTUser} from '../../chatgpt-auth';
import News from '../../news';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;await requireChatGPTUser('/articles/'+id);return <News articleId={id}/>;}
