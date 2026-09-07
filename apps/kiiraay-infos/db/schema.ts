import {sqliteTable,text,index} from 'drizzle-orm/sqlite-core';
export const records=sqliteTable('records',{id:text('id').primaryKey(),owner:text('owner').notNull(),kind:text('kind').notNull(),data:text('data').notNull(),created:text('created').notNull()},t=>[index('records_owner_kind').on(t.owner,t.kind)]);
