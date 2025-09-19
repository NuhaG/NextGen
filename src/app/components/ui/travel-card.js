import { cn } from "@/lib/utils";
import { MapPin, Star, Clock } from "lucide-react";

export function TravelCard({
  location,
  title,
  description,
  rating,
  duration,
  image,
}) {
  return (
    <div className="max-w-xs w-full group/card transition-transform duration-300 hover:scale-105">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-2xl max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
          "bg-cover bg-center",
        )}
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-40"></div>
        {/* Top section with location and rating */}
        <div className="flex flex-row items-center justify-between z-10 drop-shadow-md">
          <div className="flex items-center space-x-2 bg-black/40 px-2 py-1 rounded shadow-md">
            <MapPin className="h-4 w-4 text-white" />
            <p className="font-normal text-sm text-gray-50">{location}</p>
          </div>
          <div className="flex items-center space-x-1 bg-black/40 rounded-full px-2 py-1 shadow-md">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs text-white">{rating}</span>
          </div>
        </div>
        {/* Bottom section with destination info */}
        <div className="text content z-10 drop-shadow-md">
          <h1 className="font-bold text-xl md:text-2xl text-gray-50">{title}</h1>
          <p className="font-normal text-sm text-gray-50 my-2 line-clamp-3">{description}</p>
          <div className="flex items-center space-x-1 mt-4">
           
          </div>
        </div>
      </div>
    </div>
  );
}
