import { Candidat } from "@/types/candidat";
import { CandidatCard } from "./candidats-card";

interface CandidatListProps {
  candidats: Candidat[];
  onCandidatselect: (candidat: Candidat) => void;
  onEdit?: (candidat: Candidat) => void;
  onDelete?: (candidat: Candidat) => void;
}

export function CandidatList({
  candidats,
  onCandidatselect,
  onEdit,
  onDelete,
}: CandidatListProps) {
  if (candidats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client</h3>
        <p className="text-gray-500 mb-4">
          Commencez par ajouter votre premier client
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidats.map((candidat) => (
          <CandidatCard
            key={candidat.id}
            candidat={candidat}
            onClick={() => onCandidatselect(candidat)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
