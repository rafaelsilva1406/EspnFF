import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">ESPN Fantasy Football</h1>
          <p className="mt-2 text-gray-600">
            Modern web interface for ESPN Fantasy Sports league management
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/league" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group-hover:bg-blue-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">League Overview</h3>
                <p className="text-gray-600">View team standings, records, and league settings</p>
              </div>
            </Link>
            
            <Link href="/teams" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group-hover:bg-green-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Teams</h3>
                <p className="text-gray-600">Detailed team information and roster management</p>
              </div>
            </Link>
            
            <Link href="/players" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group-hover:bg-purple-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Players</h3>
                <p className="text-gray-600">Player stats, news, and free agent analysis</p>
              </div>
            </Link>
          </div>
          
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                This application provides a modern web interface for ESPN Fantasy Sports data.
                It supports both public and private leagues across multiple sports.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Configure your ESPN credentials in the environment variables</li>
                <li>Navigate to the League page to view your fantasy league</li>
                <li>Explore team rosters, player stats, and matchup data</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}