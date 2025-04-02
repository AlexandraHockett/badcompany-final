"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/loja/ProductCard";
import FloatingCart from "@/components/loja/FloatingCart";
import { CartItem, BaseProduct } from "@/types/types";
import {
  products,
  merchandising,
  exclusives,
  tickets,
  featuredProducts,
  sortProducts,
} from "@/data/products";
import FeaturedProduct from "@/components/loja/FeaturedProduct";
import Newsletter from "@/components/home/Newsletter";

export default function LojaPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sortOption, setSortOption] = useState("featured");
  const [filteredMerchandising, setFilteredMerchandising] =
    useState(merchandising);
  const [filteredExclusives, setFilteredExclusives] = useState(exclusives);
  const [activeTab, setActiveTab] = useState("all");

  // Sorted products based on sort option
  useEffect(() => {
    setFilteredMerchandising(sortProducts(merchandising, sortOption));
    setFilteredExclusives(sortProducts(exclusives, sortOption));
  }, [sortOption]);

  const addToCart = (item: BaseProduct) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [
          ...prevItems,
          { ...item, quantity: 1, uniqueId: `${item.id}-${Date.now()}` },
        ];
      }
    });
  };

  const onRemoveOne = (itemId: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const onRemoveAll = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  useEffect(() => {
    // Force normal scrolling behavior at the document level
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";

    return () => {
      // Cleanup when component unmounts
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Filter products based on active tab
  const filterByTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="text-white min-h-screen">
      <header className="pt-6 pb-8 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Loja BadCompany
        </motion.h1>
        <motion.p
          className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Produtos exclusivos, merchandising oficial e bilhetes para os nossos
          eventos
        </motion.p>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Product Carousel */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <FeaturedProduct
            products={featuredProducts}
            onAddToCart={addToCart}
          />
        </motion.section>

        {/* Category Tabs */}
        <motion.div
          className="mb-8 flex overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex space-x-4 mx-auto">
            <button
              onClick={() => filterByTab("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => filterByTab("merchandise")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "merchandise"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Merchandising
            </button>
            <button
              onClick={() => filterByTab("tickets")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "tickets"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Bilhetes
            </button>
            <button
              onClick={() => filterByTab("exclusives")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "exclusives"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Exclusivos
            </button>
          </div>
        </motion.div>

        {/* Sort and Filter Controls */}
        <motion.div
          className="mb-8 flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-400">
              Ordenar por:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg text-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="featured">Destaques</option>
              <option value="price-low-high">Preço: Menor ao Maior</option>
              <option value="price-high-low">Preço: Maior ao Menor</option>
              <option value="rating">Melhor Avaliados</option>
            </select>
          </div>
        </motion.div>

        {/* Merchandising Section */}
        {(activeTab === "all" || activeTab === "merchandise") && (
          <motion.section
            className="mb-16"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-200 border-b border-purple-500/30 pb-2">
              Merchandising
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMerchandising.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.image}
                  description={product.description}
                  rating={product.rating}
                  featured={product.featured}
                  available={product.available}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Tickets Section */}
        {(activeTab === "all" || activeTab === "tickets") && (
          <motion.section
            className="mb-16"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-200 border-b border-purple-500/30 pb-2">
              Bilhetes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => (
                <ProductCard
                  key={ticket.id}
                  id={ticket.id}
                  title={ticket.title}
                  price={ticket.price}
                  image={ticket.image}
                  description={ticket.description}
                  rating={ticket.rating}
                  featured={ticket.featured}
                  available={ticket.available}
                  date={ticket.date}
                  location={ticket.location}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Exclusives Section */}
        {(activeTab === "all" || activeTab === "exclusives") && (
          <motion.section
            className="mb-16"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-200 border-b border-purple-500/30 pb-2">
              Exclusivos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExclusives.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.image}
                  description={product.description}
                  rating={product.rating}
                  featured={product.featured}
                  available={product.available}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Newsletter signup */}
        <Newsletter
          title="Fique por dentro das novidades"
          subtitle="Subscreva a nossa newsletter para receber em primeira mão informações sobre lançamentos de produtos exclusivos e promoções especiais."
          className="mb-16"
        />
      </main>

      {/* Floating Cart */}
      <FloatingCart
        cartItems={cartItems}
        onRemoveOne={onRemoveOne}
        onRemoveAll={onRemoveAll}
      />
    </div>
  );
}
