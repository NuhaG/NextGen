"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { ArrowRight, MapPin, Camera, Compass, Plane } from "lucide-react";
import { TravelGrid } from "@/components/ui/travel-grid";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import Link from "next/link";

// Custom reusable Button component
function CustomButton({ children, variant = "solid", ...props }) {
  const baseClasses =
    "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
  const variants = {
    solid: "bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300",
    outline: "border-2 border-white text-white hover:bg-white/10 transition-all duration-300",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]}`} {...props}>
      {children}
    </button>
  )
}

// Adapted ImagesSlider component
function ImagesSlider({ 
  images, 
  children, 
  overlay = true, 
  overlayClassName = "", 
  className = "", 
  autoplay = true, 
  direction = "up" 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState([]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    setLoading(true);
    const loadPromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image;
        img.onload = () => resolve(image);
        img.onerror = reject;
      });
    });

    Promise.all(loadPromises)
      .then((loadedImages) => {
        setLoadedImages(loadedImages);
        setLoading(false);
      })
      .catch((error) => console.error("Failed to load images", error));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // autoplay
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  const slideVariants = {
    initial: {
      scale: 0,
      opacity: 0,
      rotateX: 45,
    },
    visible: {
      scale: 1,
      rotateX: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.645, 0.045, 0.355, 1.0],
      },
    },
    upExit: {
      opacity: 1,
      y: "-150%",
      transition: {
        duration: 1,
      },
    },
    downExit: {
      opacity: 1,
      y: "150%",
      transition: {
        duration: 1,
      },
    },
  };

  const areImagesLoaded = loadedImages.length > 0;

  return (
    <div
      className={`overflow-hidden h-full w-full relative flex items-center justify-center ${className}`}
      style={{
        perspective: "1000px",
      }}>
      {areImagesLoaded && children}
      {areImagesLoaded && overlay && (
        <div className={`absolute inset-0 bg-black/60 z-40 ${overlayClassName}`} />
      )}
      {areImagesLoaded && (
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={loadedImages[currentIndex]}
            initial="initial"
            animate="visible"
            exit={direction === "up" ? "upExit" : "downExit"}
            variants={slideVariants}
            className="h-full w-full absolute inset-0 object-cover object-center" />
        </AnimatePresence>
      )}
    </div>
  );
}

function LandingPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Circle expansion animation
  const circleScale = useTransform(scrollYProgress, [0, 0.4], [1, 25])
  const circleOpacity = useTransform(scrollYProgress, [0.3, 0.45], [1, 0])

  // Overlay animation
  const overlayY = useTransform(scrollYProgress, [0.6, 0.8], ["100%", "0%"]) 

  // Text animations (hero)
  const heroTextY = useTransform(scrollYProgress, [0, 0.25], [0, -80])
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  // New: scroll-based slide for features
  const featureSectionRef = useRef(null)
  const { scrollYProgress: featuresScroll } = useScroll({
    target: featureSectionRef,
    offset: ["start end", "end start"],
  })
  const featuresY = useTransform(featuresScroll, [0, 1], [100, -100])
  const featuresOpacity = useTransform(featuresScroll, [0, 0.2, 1], [0, 1, 0.8])

  const [currentText, setCurrentText] = useState("")
  const [textIndex, setTextIndex] = useState(0)
  const texts = ["Explore The World", "Create Memories", "Adventure Awaits"]

  // Sample travel images - replace with your own
  const travelImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2035&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
  ]

  // Typewriter effect
  useEffect(() => {
    const text = texts[textIndex]
    let i = 0
    const timer = setInterval(() => {
      setCurrentText(text.slice(0, i))
      i++
      if (i > text.length) {
        clearInterval(timer)
        setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % texts.length)
        }, 2000)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [textIndex])

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section with Image Slider Background */}
      <section className="relative h-screen flex items-center justify-between px-8 lg:px-16 overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          <ImagesSlider
            images={travelImages}
            overlay={true}
            overlayClassName="bg-black/40"
            autoplay={true}
            direction="up"
            className="h-full w-full"
          />
        </div>

        {/* Left side content */}
        <motion.div className="flex-1 max-w-2xl z-10 relative" style={{ y: heroTextY, opacity: heroTextOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-4 text-balance drop-shadow-2xl">
              {currentText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                className="text-green-400"
              >
                |
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-white/90 mb-8 text-pretty drop-shadow-lg"
            >
              Discover breathtaking destinations, plan unforgettable journeys, and create memories that last a lifetime
              with our premium travel experiences.
            </motion.p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex gap-4"
          >
            <Link href="/places">
              <CustomButton>
                Explore New places<ArrowRight className="ml-2 h-4 w-4" />
              </CustomButton>
            </Link>
            <Link href="/map">
              <CustomButton variant="outline">View Destinations</CustomButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right side - animated circle overlay */}
        <motion.div
          className="relative flex-1 flex justify-center items-center z-20"
          style={{ scale: circleScale, opacity: circleOpacity }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100 }}
            className="w-96 h-96 bg-teal-500 backdrop-blur-sm rounded-full flex items-center justify-center relative overflow-hidden border-4 border-white/20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 1.2, type: 'spring' }}
              className="text-white"
            >
              <Plane className="w-20 h-20 drop-shadow-lg" />
            </motion.div>

            {/* floating dots */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{
                rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
              }}
              className="absolute inset-0"
            >
              <div className="absolute top-8 left-8 w-4 h-4 bg-white/60 rounded-full" />
              <div className="absolute bottom-8 right-8 w-6 h-6 bg-white/70 rounded-full" />
              <div className="absolute top-1/2 right-4 w-3 h-3 bg-white/50 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>


      </section>

      {/* Features Section */}
      <section
        ref={featureSectionRef}
        className="sticky top-0 z-10 py-20 bg-gradient-to-b from-teal-500 to-blue-600 flex items-center justify-center min-h-screen"
        style={{height: '100vh'}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div style={{ y: featuresY, opacity: featuresOpacity }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Travel Features</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Everything you need for your perfect travel experience
            </p>
          </motion.div>
          
          <div className="relative h-[400px] overflow-hidden">
            <InfiniteMovingCards
              items={[
                {
                  icon: '🔍',
                  title: 'Discover New Places',
                  description: 'Explore hidden gems and popular destinations with our intelligent search and recommendations.'
                },
                {
                  icon: '📍',
                  title: 'Live Geolocation',
                  description: 'Real-time location tracking and interactive maps to navigate any destination with confidence.'
                },
                {
                  icon: '👩‍🦰',
                  title: 'Solo Women Travelers',
                  description: 'Safety-first features and verified stays designed to support and empower solo women on their journeys.'
                },
                {
                  icon: '✈️',
                  title: 'Curated Travel Lists',
                  description: 'Handpicked destinations and itineraries based on your interests and travel style.'
                },
                {
                  icon: '🌍',
                  title: 'Local Experiences',
                  description: 'Authentic tours and activities hosted by local experts and insiders.'
                }
                
              ]}
              direction="left"
              speed="normal"
              className="mt-12"
            />
          </div>
        </div>
      </section> 
      {/* Third Section: Travel Grid */}
      <div className="bg-white w-full relative z-10">
        <TravelGrid />
      </div>
    </div>
  )
}

export default LandingPage