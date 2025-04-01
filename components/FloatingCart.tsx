"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CartItem, BaseProduct } from "@/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "./Button";

interface FloatingCartProps {
  cartItems: CartItem[];
  onRemoveOne: (itemId: number) => void;
  onRemoveAll: (itemId: number) => void;
  onAddToCart?: (item: BaseProduct) => void;
}

export default function FloatingCart({
  cartItems,
  onRemoveOne,
  onRemoveAll,
  onAddToCart,
}: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + parseFloat(item.price.replace("€", "")) * item.quantity,
    0
  );

  const closeCart = () => {
    setIsOpen(false);
  };

  const handleCheckout = () => {
    if (!session) {
      // If not logged in, redirect to login with callback URL
      router.push(`/login?callbackUrl=${encodeURIComponent("/loja/checkout")}`);
      closeCart();
    } else {
      // If logged in, proceed to checkout
      router.push("/loja/checkout");
      closeCart();
    }
  };
  return (
    <>
      {/* Cart Button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </motion.div>

      {/* Cart Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeCart}
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 right-0 h-[calc(100%-80px)] max-h-[90vh] w-full sm:w-96 bg-gray-900 shadow-xl z-50 flex flex-col rounded-t-xl"
            >
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  Seu Carrinho ({totalItems})
                </h2>
                <button
                  onClick={closeCart}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close cart"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-500 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-gray-400">Seu carrinho está vazio</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.li
                        key={item.uniqueId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-4 p-3 rounded-lg bg-gray-800"
                      >
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">
                            {item.title}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {item.price} x {item.quantity}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => onRemoveOne(item.id)}
                              className="p-1 text-gray-400 hover:text-white"
                              aria-label="Remove one"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="text-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onAddToCart ? onAddToCart(item) : null
                              }
                              className="p-1 text-gray-400 hover:text-white"
                              aria-label="Add one"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => onRemoveAll(item.id)}
                              className="ml-auto p-1 text-red-400 hover:text-red-500"
                              aria-label="Remove all"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-4 border-t border-gray-800">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-300">Total:</span>
                  <span className="text-white font-bold">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button
                  title="Finalizar Compra"
                  onClick={() => router.push("/loja/checkout")}
                  containerClass="w-full"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
