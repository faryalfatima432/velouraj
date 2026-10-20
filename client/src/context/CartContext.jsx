import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) {
      return [];
    }

    try {
      return JSON.parse(savedCart);
    } catch {
      localStorage.removeItem("cart");
      return [];
    }
  });

  // Save cart whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add product to cart
  const addToCart = (product, quantity = 1) => {
    if (!product) {
      return;
    }

    if (product.stock <= 0) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        const newQuantity =
          existingItem.quantity + quantity;

        return currentItems.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Math.min(
                  newQuantity,
                  product.stock
                ),
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice,
          images: product.images,
          stock: product.stock,
          category: product.category,
          quantity: Math.min(quantity, product.stock),
        },
      ];
    });
  };

  // Remove product
  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item._id !== productId
      )
    );
  };

  // Increase quantity
  const increaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item._id !== productId) {
          return item;
        }

        if (item.quantity >= item.stock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  };

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item._id !== productId) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity - 1,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Update exact quantity
  const updateQuantity = (productId, quantity) => {
    const newQuantity = Number(quantity);

    if (Number.isNaN(newQuantity)) {
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item._id !== productId) {
          return item;
        }

        if (newQuantity <= 0) {
          return {
            ...item,
            quantity: 1,
          };
        }

        return {
          ...item,
          quantity: Math.min(
            newQuantity,
            item.stock
          ),
        };
      })
    );
  };

  // Clear complete cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Price helper
  const getItemPrice = (item) => {
    if (
      item.salePrice !== null &&
      item.salePrice !== undefined &&
      Number(item.salePrice) > 0
    ) {
      return Number(item.salePrice);
    }

    return Number(item.price);
  };

  // Total number of products
  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cartItems]);

  // Cart subtotal
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        getItemPrice(item) * item.quantity,
      0
    );
  }, [cartItems]);

  const value = {
    cartItems,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    getItemPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}