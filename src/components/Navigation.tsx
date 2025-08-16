import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              ESPN FF
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/league" 
              className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              League
            </Link>
            <Link 
              href="/teams" 
              className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Teams
            </Link>
            <Link 
              href="/players" 
              className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Players
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}