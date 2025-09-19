"use client";
import { cn } from "@/lib/utils";
import React, { useState, useMemo } from "react";
import { Cards } from "./Cards";
import data from "@/data/data";

export function PlacesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique categories for the filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(data.map(place => place.category))];
    return uniqueCategories;
  }, []);

  // Filter places based on search query and selected category
  const filteredPlaces = useMemo(() => {
    const filtered = data.filter((place) => {
      const matchesSearch = 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "all" || place.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    // Limit to only 3 cards
    return filtered.slice(0, 3);
  }, [searchQuery, selectedCategory]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
        )} />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      
      {/* Search Section */}
      <div className="relative z-10 pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Amazing Places
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Search and explore destinations across India
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, city, state, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Category Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Clear Button */}
              {(searchQuery || selectedCategory !== "all") && (
                <button
                  onClick={handleClearSearch}
                  className="lg:w-auto w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search Results Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Showing top 3 places {searchQuery ? `for "${searchQuery}"` : ''} {selectedCategory !== 'all' ? `in ${selectedCategory.replace('_', ' ')} category` : ''}
            </p>
          </div>
        </div>
      </div>
      
      {/* Places Grid */}
      <div className="relative z-10 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {filteredPlaces.length > 0 ? (
            <div className="flex justify-center items-center gap-24 flex-wrap">
              {filteredPlaces.map((place) => (
                <div key={place.name} className="flex-shrink-0">
                  <Cards place={place} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No places found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search terms or category filter
              </p>
              <button
                onClick={handleClearSearch}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
