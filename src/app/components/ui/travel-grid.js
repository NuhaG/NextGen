"use client";

import { motion } from "framer-motion";
import { TravelCard } from "./travel-card";

const destinationsData = [
  {
    id: 1,
    location: "Paris, France",
    title: "Eiffel Tower Experience",
    description:
      "A romantic getaway in the heart of Paris, featuring iconic landmarks and gourmet cuisine.",
    rating: 4.8,
    duration: "5 days",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    location: "Kyoto, Japan",
    title: "Cherry Blossom Retreat",
    description:
      "Witness the breathtaking sakura season and explore ancient temples and gardens.",
    rating: 4.9,
    duration: "7 days",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    location: "Santorini, Greece",
    title: "Sunset Paradise",
    description:
      "Relax on white-washed terraces with stunning sea views and vibrant sunsets.",
    rating: 4.7,
    duration: "6 days",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
];

export function TravelGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Discover Amazing Destinations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto text-center px-4 font-medium"
          >
            🌍 Explore our handpicked collection of{" "}
            <span className="text-blue-600 font-semibold">
              breathtaking destinations
            </span>{" "}
            around the world. From{" "}
            <span className="text-emerald-600 font-semibold">
              tropical paradises
            </span>{" "}
            to{" "}
            <span className="text-rose-600 font-semibold">bustling cities</span>,
            find your perfect getaway.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
        >
          {destinationsData.map((destination) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <TravelCard
                location={destination.location}
                title={destination.title}
                description={destination.description}
                rating={destination.rating}
                duration={destination.duration}
                image={destination.image}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
