import Image from "next/image";
import { TypewriterEffectSmooth } from "../../components/ui/typewriter-effect";
import { DirectionAwareHover } from "../../components/ui/direction-aware-hover";
import data from "../../data/data.js";
import { slugify } from "@/lib/slugify";

export default function Details({ params }) {
  const { slug } = params;
  console.log("Slug from URL:", slug);

  // Match the slugified name with the URL slug
  const selectedPlace = data.find((item) => slugify(item.name) === slug);

  if (!selectedPlace) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-gray-600">Place not found</div>
    </div>;
  }

  // Format date and time for better display
  const formatDateTime = (dateTime) => {
    const [date, time] = dateTime.split(' ');
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return { date: formattedDate, time };
  };

  // Sort travel companies by price (ascending)
  const sortedTravelCompanies = selectedPlace.travel_companies
    ? [...selectedPlace.travel_companies].sort((a, b) => a.price - b.price)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <TypewriterEffectSmooth words={[{ text: selectedPlace.name }]} />
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {selectedPlace.city}, {selectedPlace.state}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full capitalize">
              {selectedPlace.category.replace('_', ' ')}
            </span>
            {selectedPlace.saved && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                ⭐ Saved
              </span>
            )}
          </div>
        </div>

        {/* Image and Description Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <DirectionAwareHover imageUrl={selectedPlace.image} />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">About this place</h3>
            <p className="text-gray-600 leading-relaxed">{selectedPlace.description}</p>
            {selectedPlace.review && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Review</h4>
                <p className="text-gray-600 italic">"{selectedPlace.review}"</p>
              </div>
            )}
            {selectedPlace.contact_number && (
              <div className="mt-4">
                <span className="inline-flex items-center text-blue-600">
                  📞 {selectedPlace.contact_number}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Travel Itinerary Section */}
        {sortedTravelCompanies.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="bg-blue-500 text-white p-3 rounded-lg mr-4">
                🗓️
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Travel Itinerary</h2>
                <p className="text-gray-600">Available tour packages from trusted travel companies</p>
              </div>
            </div>

            <div className="space-y-4">
              {sortedTravelCompanies.map((company, index) => {
                const { date, time } = formatDateTime(company.date_time);
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                            #{index + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {company.company_name}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">📅</span>
                            <div>
                              <div className="font-medium">{date}</div>
                              <div className="text-sm text-gray-500">Departure Date</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">🕐</span>
                            <div>
                              <div className="font-medium">{time}</div>
                              <div className="text-sm text-gray-500">Departure Time</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 lg:mt-0 lg:ml-6">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600">
                            ₹{company.price.toLocaleString('en-IN')}
                          </div>
                          <div className="text-sm text-gray-500">per person</div>
                          <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">💡 Travel Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Prices are sorted from lowest to highest</li>
                <li>• Book early to get better deals and availability</li>
                <li>• Contact the travel company directly for custom packages</li>
                <li>• Check cancellation policies before booking</li>
              </ul>
            </div>
          </div>
        )}

        {/* No Travel Companies Available */}
        {sortedTravelCompanies.length === 0 && selectedPlace.category === 'tourist_place' && (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-gray-400 mb-4">
              <span className="text-6xl">🏢</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Travel Packages Available
            </h3>
            <p className="text-gray-600">
              Unfortunately, there are no travel packages available for this destination at the moment.
              Please check back later or contact local tour operators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
