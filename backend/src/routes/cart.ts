import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Lightweight in-memory store used while DB generation/migration is resolved.
const userCarts: Record<string, { productId: string; name?: string; price: number; quantity: number }[]> = {};

/**
 * POST /api/cart/sync
 * Body: { items: Array<{ productId, name?, price, quantity }> }
 * Behavior: merge-by-quantity with any existing server-side cart for the user, return merged cart.
 */
router.post('/sync', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const clientItems = Array.isArray(req.body?.items) ? req.body.items : [];

    const existing = userCarts[userId] || [];

    const map: Record<string, { productId: string; name?: string; price: number; quantity: number }> = {};

    // add existing
    for (const it of existing) {
      map[it.productId] = { ...it };
    }

    // merge client (by summing quantities)
    for (const it of clientItems) {
      if (!it || !it.productId) continue;
      const pid = String(it.productId);
      const prev = map[pid];
      if (prev) {
        prev.quantity = (prev.quantity || 0) + (it.quantity || 0);
      } else {
        map[pid] = { productId: pid, name: it.name, price: Number(it.price) || 0, quantity: it.quantity || 0 };
      }
    }

    const merged = Object.values(map);
    userCarts[userId] = merged;

    return res.json({ items: merged });
  } catch (err) {
    console.error('cart.sync error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
