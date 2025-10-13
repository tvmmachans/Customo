import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MiniCart: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { items, updateItem, removeItem, subtotal } = useCart();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    // show panel with animation
    requestAnimationFrame(() => setVisible(true));
    // add modal-open class to body to prevent background scroll
    document.body.classList.add('modal-open');
    // focus the close button when opened (after open animation starts)
    setTimeout(() => closeBtnRef.current?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') startClose();
      if (e.key === 'Tab') {
        // simple focus trap
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-open');
      prev?.focus?.();
    };
  }, [onClose]);

  // helper to close with animation
  const startClose = () => {
    setVisible(false);
    // remove modal class immediately so background can return to normal while panel animates
    document.body.classList.remove('modal-open');
    // wait for CSS animation to complete then call parent's onClose
    window.setTimeout(() => onClose(), 260);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={startClose} aria-hidden />
      <div
        ref={containerRef}
        className={`pointer-events-auto w-full max-w-sm p-4 mini-cart-panel ${visible ? 'open' : ''}`}
      >
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Your Cart</h3>
              <div className="flex items-center gap-2">
                <Button ref={closeBtnRef as any} variant="ghost" size="sm" onClick={startClose}>
                  <X />
                </Button>
              </div>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {items.map((it) => (
                  <div key={it.productId} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-muted-foreground">${it.price} x {it.quantity}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateItem(it.productId, Math.max(1, it.quantity - 1))}>-</Button>
                      <span className="px-2">{it.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => updateItem(it.productId, it.quantity + 1)}>+</Button>
                      <Button size="sm" variant="ghost" onClick={() => removeItem(it.productId)}>Remove</Button>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <div className="flex justify-between font-semibold">Subtotal <span>${subtotal.toLocaleString()}</span></div>
                  <div className="flex gap-2 mt-3">
                    <Link to="/cart" onClick={startClose} className="flex-1">
                      <Button variant="outline" className="w-full">View Cart</Button>
                    </Link>
                    <Button variant="cta" className="flex-1" onClick={() => { startClose(); navigate('/checkout'); }}>Checkout</Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>,
    document.body
  );
};

export default MiniCart;
