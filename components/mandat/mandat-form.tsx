import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mandat } from "@/types/mandat";
import { useClients } from "@/hooks/use-clients";
import { useEffect } from "react";

const mandatSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type_contrat: z.enum(["determine", "indetermine"]).optional(),
  niveau_experience: z.string().optional(),
  statut: z.enum(["ouvert", "en_cours", "ferme", "suspendu"]),
  salaire_min: z.number().min(0).optional(),
  salaire_max: z.number().min(0).optional(),
  localisation: z.string().optional(),
  date_debut: z.string().optional(),
  priorite: z.enum(["basse", "normale", "haute"]).optional(),
  nombre_postes: z.number().min(1).optional(),
  notes: z.string().optional(),
  entreprise_id: z.string().min(1, "Le client est requis"),
});

type MandatFormData = z.infer<typeof mandatSchema>;

interface MandatFormProps {
  onSubmit: (data: MandatFormData) => Promise<void>;
  onCancel: () => void;
  mandat?: Mandat | null;
  mode: "create" | "edit";
  preSelectedClientId?: string;
  isSubmitting?: boolean;
}

export function MandatForm({
  onSubmit,
  onCancel,
  mandat,
  mode,
  preSelectedClientId,
  isSubmitting = false,
}: MandatFormProps) {
  const { clients, loading: clientsLoading } = useClients();
  const form = useForm<MandatFormData>({
    resolver: zodResolver(mandatSchema),
    defaultValues: {
      titre: mandat?.titre || "",
      description: mandat?.description || "",
      type_contrat: mandat?.type_contrat,
      niveau_experience: mandat?.niveau_experience || "",
      statut: mandat?.statut || "ouvert",
      salaire_min: mandat?.salaire_min,
      salaire_max: mandat?.salaire_max,
      localisation: mandat?.localisation || "",
      date_debut: mandat?.date_debut || "",
      priorite: mandat?.priorite || "normale",
      nombre_postes: mandat?.nombre_postes || 1,
      notes: mandat?.notes || "",
      entreprise_id: mandat?.entreprise_id || preSelectedClientId || "",
    },
  });

  // Reset form when mandat changes
  useEffect(() => {
    if (mandat) {
      form.reset({
        titre: mandat.titre,
        description: mandat.description || "",
        type_contrat: mandat.type_contrat,
        niveau_experience: mandat.niveau_experience || "",
        statut: mandat.statut || "ouvert",
        salaire_min: mandat.salaire_min,
        salaire_max: mandat.salaire_max,
        localisation: mandat.localisation || "",
        date_debut: mandat.date_debut || "",
        priorite: mandat.priorite || "normale",
        nombre_postes: mandat.nombre_postes || 1,
        notes: mandat.notes || "",
        entreprise_id: mandat.entreprise_id,
      });
    } else {
      form.reset({
        titre: "",
        description: "",
        type_contrat: undefined,
        niveau_experience: "",
        statut: "ouvert",
        salaire_min: undefined,
        salaire_max: undefined,
        localisation: "",
        date_debut: "",
        priorite: "normale",
        nombre_postes: 1,
        notes: "",
        entreprise_id: preSelectedClientId || "",
      });
    }
  }, [mandat, form, preSelectedClientId]);

  const handleSubmit = async (data: MandatFormData) => {
    try {
      await onSubmit(data);
      if (mode === "create") {
        form.reset();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {mode === "edit" ? "Modifier le mandat" : "Nouveau mandat"}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {mode === "edit"
            ? "Modifiez les informations du mandat"
            : "Ajoutez un nouveau mandat à votre entreprise"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du poste *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Développeur Full Stack"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entreprise_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={clientsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {field.value && clients.length > 0 ? (
                          <span>{clients.find((client) => client.id === field.value)?.nom || "Client introuvable"}</span>
                        ) : (
                          <SelectValue
                            placeholder={
                              clientsLoading
                                ? "Chargement..."
                                : "Sélectionner un client"
                            }
                          />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type_contrat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de contrat</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de contrat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="determine">Déterminé</SelectItem>
                      <SelectItem value="indetermine">Indéterminé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ouvert">Ouvert</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="ferme">Fermé</SelectItem>
                      <SelectItem value="suspendu">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="localisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Paris, Remote, Lyon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salaire_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaire minimum (k€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ex: 45"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salaire_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaire maximum (k€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ex: 65"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="niveau_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau d&apos;expérience</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Junior, Senior, Expert"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priorite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorité</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une priorité" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basse">Basse</SelectItem>
                      <SelectItem value="normale">Normale</SelectItem>
                      <SelectItem value="haute">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre_postes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de postes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : 1
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date_debut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de début</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez le poste, les missions, les compétences requises..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notes internes, commentaires..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || form.formState.isSubmitting}
            >
              {isSubmitting || form.formState.isSubmitting
                ? "En cours..."
                : mode === "edit"
                ? "Modifier"
                : "Créer le mandat"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
