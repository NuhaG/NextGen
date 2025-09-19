import { Plane } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">NextGen Travel</span>
        </Link>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6">
            <Link href="/places" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Places</Link>
    
            <Link href="/map" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">map</Link>
          </nav>
          
          {/* SOS Button */}
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-md hover:shadow-lg">
            SOS
          </button>
        </div>
      </div>
    </header>
  );
}
