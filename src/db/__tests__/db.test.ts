import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../index';
import { menuItems, orders } from '../schema';
import { eq } from 'drizzle-orm';

describe('Database Integration', () => {
  beforeEach(async () => {
    // Clean up test data before each test
    await db.delete(menuItems).where(eq(menuItems.id, 'test-item-1'));
    await db.delete(orders).where(eq(orders.id, 'order-1'));
  });

  it('should write and read menu items', async () => {
    const item = {
      id: 'test-item-1',
      name: 'Test Burger',
      categoryId: 'burgers',
      price: 12.99,
      taxRate: 0.08,
      isAvailable: true,
    };

    await db.insert(menuItems).values(item);

    const result = await db.select().from(menuItems).where(eq(menuItems.id, 'test-item-1'));
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(item);
  });

  it('should write and read orders', async () => {
    const fixedTimestamp = 1705420800000; // 2024-01-16 12:00:00 UTC
    const order = {
      id: 'order-1',
      terminalId: 'term-1',
      staffId: 'staff-1',
      subtotal: 20.0,
      tax: 1.6,
      total: 21.6,
      status: 'pending',
      createdAt: fixedTimestamp,
      updatedAt: fixedTimestamp,
    };

    await db.insert(orders).values(order);

    const result = await db.select().from(orders).where(eq(orders.id, 'order-1'));
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(order);
  });
});
