import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

function loadCart() {
  try {
    const data = localStorage.getItem('uce_cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem('uce_cart', JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        quantity,
        maxStock: product.stock,
      }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.productId !== productId));
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.maxStock) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // Could add tax, shipping etc.

  const value = {
    items,
    itemCount,
    subtotal,
    total,
    isCartOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setIsCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export default CartContext;
