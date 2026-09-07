import {requireChatGPTUser} from './chatgpt-auth';
import News from './news';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/');return <News/>;}
