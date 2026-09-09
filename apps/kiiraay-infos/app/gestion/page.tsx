import {requireAdmin} from '../admin-auth';
import Dashboard from '../dashboard';
export const dynamic='force-dynamic';
export default async function Page(){await requireAdmin('/gestion');return <Dashboard/>;}
