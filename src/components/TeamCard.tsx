import type { Team } from '@/types/espn';
import Image from 'next/image';

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {team.location} {team.name}
          </h3>
          <p className="text-sm text-gray-500">{team.abbrev}</p>
        </div>
        {team.logo && (
          <Image 
            src={team.logo} 
            alt={`${team.name} logo`}
            width={48}
            height={48}
            className="object-contain"
          />
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Record:</span>
          <span className="ml-2 font-medium">
            {team.record.wins}-{team.record.losses}-{team.record.ties}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Points For:</span>
          <span className="ml-2 font-medium">{team.pointsFor.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-gray-600">Points Against:</span>
          <span className="ml-2 font-medium">{team.pointsAgainst.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-gray-600">Roster Size:</span>
          <span className="ml-2 font-medium">{team.roster.length}</span>
        </div>
      </div>
    </div>
  );
}