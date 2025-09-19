"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// ✅ Dynamic import only for components (to avoid SSR issues)
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import("react-leaflet").then(m => m.TileLayer),    { ssr: false });
const Marker       = dynamic(() => import("react-leaflet").then(m => m.Marker),       { ssr: false });
const Popup        = dynamic(() => import("react-leaflet").then(m => m.Popup),        { ssr: false });

// ✅ Static import for hook (hooks cannot be dynamically imported)
import { useMap } from "react-leaflet";

export default function MapPage() {
  const [position, setPosition] = useState([19.0760, 72.8777]); // Mumbai default
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("restaurant");

  const tagMap = {
    restaurant: { key: "amenity", value: "restaurant" },
    cafe:       { key: "amenity", value: "cafe" },
    bar:        { key: "amenity", value: "bar" },
    museum:     { key: "tourism", value: "museum" },
    park:       { key: "leisure", value: "park" },
    hospital:   { key: "amenity", value: "hospital" },
  };

  // ✅ Recenter component
  function Recenter({ coords }) {
    const map = useMap();  // now returns actual Leaflet map
    useEffect(() => {
      if (map && map.setView) {
        map.setView(coords, 14);
      }
    }, [coords, map]);
    return null;
  }

  // Fix default Leaflet icon URLs
  useEffect(() => {
    (async () => {
      const L = await import("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    })();

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  // Fetch nearby places from Overpass API
  const fetchNearby = async (lat, lon, type) => {
    const tag = tagMap[type.toLowerCase()];
    if (!tag) return;
    const query = `[out:json];node["${tag.key}"="${tag.value}"](around:1000,${lat},${lon});out;`;
    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);
    try {
      const res = await fetch(url);
      const data = await res.json();
      setNearbyPlaces(data.elements.slice(0, 30));
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch coordinates by location name
  const fetchLocation = async (query) => {
    if (!query) return;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Location not found");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Refresh places when position or category changes
  useEffect(() => {
    if (position) fetchNearby(position[0], position[1], category);
  }, [position, category]);

  return (
    <div className="flex h-screen">
      {/* Map */}
      <div className="w-2/3 h-full">
        <MapContainer center={position} zoom={14} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {/* ✅ Recenter map when position updates */}
          <Recenter coords={position} />
          <Marker position={position}><Popup>You are here!</Popup></Marker>
          {nearbyPlaces.map(p => (
            <Marker key={p.id} position={[p.lat, p.lon]}>
              <Popup>{p.tags.name || category}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Sidebar */}
      <div className="w-1/3 h-full p-4 flex flex-col bg-gray-50 text-black">
        <input
          type="text"
          placeholder="Enter location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded mb-2"
        />
        <button
          onClick={() => fetchLocation(searchQuery)}
          className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 mb-4"
        >
          Search Location
        </button>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded mb-4"
        >
          {Object.keys(tagMap).map(key => (
            <option key={key} value={key}>{key.replace("_", " ")}</option>
          ))}
        </select>

        <h2 className="text-lg font-semibold mb-2">Nearby {category}</h2>
        {nearbyPlaces.length === 0 && <p>No results found.</p>}
        <ul className="space-y-2 flex-1 overflow-y-auto">
          {nearbyPlaces.map(place => (
            <li
              key={place.id}
              className="bg-white p-3 rounded shadow hover:bg-gray-100 cursor-pointer"
            >
              <p className="font-semibold">{place.tags.name || category}</p>
              <p className="text-sm text-gray-700">
                Lat: {place.lat.toFixed(4)}, Lon: {place.lon.toFixed(4)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
