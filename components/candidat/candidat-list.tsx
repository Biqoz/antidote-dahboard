import { User, MapPin, Briefcase, Eye, Mail, Phone } from "lucide-react";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CandidatListProps {
  candidats: Candidat[];
  loading: boolean;
  onCandidatSelect?: (candidat: Candidat) => void;
}

export function CandidatList({
  candidats,
  loading,
  onCandidatSelect,
}: CandidatListProps) {
  if (loading) {
    return <LoadingState count={3} className="h-32" />;
  }

  if (candidats.length === 0) {
    return (
      <EmptyState
        title="Aucun candidat"
        description="Aucun candidat n'a été ajouté au vivier"
        actionLabel="Ajouter le premier candidat"
        onAction={() => {
          /* TODO: Implement create candidat */
        }}
        icon={
          <div className="p-4 bg-gray-100 rounded-full">
            <User className="h-8 w-8 text-gray-400" />
          </div>
        }
      />
    );
  }

  const getStatusColor = (statut?: string) => {
    switch (statut) {
      case "actif":
        return "bg-green-100 text-green-800 border-green-200";
      case "en_recherche":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "place":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "inactif":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (statut?: string) => {
    switch (statut) {
      case "actif":
        return "Actif";
      case "en_recherche":
        return "En recherche";
      case "place":
        return "Placé";
      case "inactif":
        return "Inactif";
      default:
        return "Non défini";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidat</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Spécialisation</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Expérience</TableHead>
            <TableHead>Salaire</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidats.map((candidat) => (
            <TableRow key={candidat.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {candidat.prenom} {candidat.nom}
                    </div>
                    {candidat.adresse && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">{candidat.adresse}</span>
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusColor(candidat.statut)}
                >
                  {getStatusLabel(candidat.statut)}
                </Badge>
              </TableCell>
              <TableCell>
                {candidat.specialisation ? (
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-sm truncate max-w-[150px]">
                      {candidat.specialisation}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Non définie</span>
                )}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {candidat.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <a
                        href={`mailto:${candidat.email}`}
                        className="text-sm text-blue-600 hover:underline truncate max-w-[150px]"
                      >
                        {candidat.email}
                      </a>
                    </div>
                  )}
                  {candidat.telephone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      <a
                        href={`tel:${candidat.telephone}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {candidat.telephone}
                      </a>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {candidat.niveau_experience ? (
                  <Badge variant="secondary" className="text-xs">
                    {candidat.niveau_experience}
                  </Badge>
                ) : (
                  <span className="text-gray-400 text-sm">Non défini</span>
                )}
              </TableCell>
              <TableCell>
                {candidat.salaire_souhaite ? (
                  <span className="text-sm font-medium">
                    {candidat.salaire_souhaite.toLocaleString()}€
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">Non défini</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCandidatSelect?.(candidat)}
                  className="h-8 px-3"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Voir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
