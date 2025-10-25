import { MANDAT_STATUS } from "@/lib/constants";
import { Mandat } from "@/types/mandat";

interface MandatStatusProps {
  statut: Mandat["statut"];
}

export function MandatStatus({ statut }: MandatStatusProps) {
  const status = MANDAT_STATUS[statut as keyof typeof MANDAT_STATUS] || MANDAT_STATUS.ouvert;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
      {status.icon} {status.label}
    </span>
  );
}