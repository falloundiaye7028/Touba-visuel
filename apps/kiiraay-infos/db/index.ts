import {neon} from '@neondatabase/serverless';
export function database(){const url=process.env.DATABASE_URL;if(!url)throw Error('DATABASE_NOT_CONFIGURED');return neon(url);}
