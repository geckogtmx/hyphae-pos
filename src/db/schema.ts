
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const orders = sqliteTable('orders', {
    id: text('id').primaryKey(),
    terminalId: text('terminal_id').notNull(),
    staffId: text('staff_id').notNull(),
    subtotal: real('subtotal').notNull(),
    tax: real('tax').notNull(),
    total: real('total').notNull(),
    status: text('status').notNull().default('pending'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
});

export const menuItems = sqliteTable('menu_items', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    categoryId: text('category_id').notNull(),
    price: real('price').notNull(),
    taxRate: real('tax_rate').notNull(),
    isAvailable: integer('is_available', { mode: 'boolean' }).notNull().default(true),
});
