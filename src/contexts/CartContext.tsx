import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateItem: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  subtotal: number;
  // timestamp updated when cart changes (useful for analytics/pulse animation)
  lastUpdated: number | null;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_KEY = 'cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY) || '[]';
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  });
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
      // ignore
    }
  }, [items]);

  // Sync with server for authenticated users (debounced)
  useEffect(() => {
    if (!token) return;
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

  const debounceMs = Number((import.meta as any).env?.VITE_CART_SYNC_MS ?? 600);

    const sync = async () => {
      try {
        // normalize items to backend-friendly shape (productId as string)
        const payload = items.map((it) => ({ ...it, productId: String(it.productId) }));
        const res = await fetch('/api/cart/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: payload }),
        });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          // if server returns authoritative cart, adopt it (normalize types)
          if (Array.isArray(data?.items)) {
            const normalized = data.items.map((it: any) => ({
              productId: Number(it.productId) || it.productId,
              name: it.name || '',
              price: Number(it.price) || 0,
              quantity: Number(it.quantity) || 0,
            }));
            setItems(normalized);
          }
        }
      } catch (err) {
        // network errors are non-fatal; we'll retry on next change
      }
    };

    // debounce writes to server to avoid frequent requests
    timer = setTimeout(sync, debounceMs);

    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [items, token]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) {
        try {
          setItems(JSON.parse(e.newValue || '[]'));
        } catch (err) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      const q = item.quantity ?? 1;
      const existing = prev.find((p) => p.productId === item.productId);
      const next = existing
        ? prev.map((p) => (p.productId === item.productId ? { ...p, quantity: p.quantity + q } : p))
        : [...prev, { ...item, quantity: q }];
      setLastUpdated(Date.now());
      return next;
    });
  };

  const updateItem = (productId: number, quantity: number) => {
    setItems((prev) => {
      const next = prev.map((p) => (p.productId === productId ? { ...p, quantity } : p));
      setLastUpdated(Date.now());
      return next;
    });
  };

  const removeItem = (productId: number) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.productId !== productId);
      setLastUpdated(Date.now());
      return next;
    });
  };

  const clear = () => setItems([]);

  // ensure clearing also updates timestamp
  const clearWithStamp = () => {
    setItems([]);
    setLastUpdated(Date.now());
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateItem, removeItem, clear: clearWithStamp, subtotal, lastUpdated }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export default CartContext;
