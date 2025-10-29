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
import { useEffect, useState } from "react";
import {
  CONTRACT_TYPES,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  COMPANY_SIZES,
  WORK_MODES,
  EDUCATION_LEVELS,
  PRIORITY_LEVELS,
  SECTORS,
  LANGUAGES,
  BENEFITS,
} from "@/lib/constants";

const mandatSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type_contrat: z.enum(["determine", "indetermine"]).optional(),
  type_poste: z.enum(["temps_plein", "temps_partiel", "contrat"]).optional(),
  niveau_experience: z
    .enum([
      "debutant",
      "intermediaire",
      "senior",
      "directeur",
      "cadre_dirigeant",
    ])
    .optional(),
  secteur_activite: z.string().optional(),
  taille_entreprise: z
    .enum(["startup", "pme", "eti", "grande_entreprise", "administration"])
    .optional(),
  mode_travail: z.enum(["sur_site", "hybride", "teletravail"]).optional(),
  niveau_etudes: z.enum(["bac_5", "doctorat"]).optional(),
  langues_requises: z.array(z.string()).optional(),
  avantages: z.array(z.string()).optional(),
  statut: z.enum(["ouvert", "en_cours", "ferme", "suspendu"]),
  salaire_min: z.number().min(0).optional(),
  salaire_max: z.number().min(0).optional(),
  localisation: z.string().optional(),
  competences_requises: z.string().optional(),
  competences_souhaitees: z.string().optional(),
  date_debut: z.string().optional(),
  priorite: z.enum(["basse", "normale", "haute"]).optional(),
  nombre_postes: z.number().min(1).optional(),
  entreprise_id: z.string().min(1, "Le client est requis"),
});

export type MandatFormData = z.infer<typeof mandatSchema>;

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
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    mandat?.langues_requises || []
  );
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(
    mandat?.avantages || []
  );

  const form = useForm<MandatFormData>({
    resolver: zodResolver(mandatSchema),
    defaultValues: {
      titre: mandat?.titre || "",
      description: mandat?.description || "",
      type_contrat: mandat?.type_contrat,
      type_poste: mandat?.type_poste,
      niveau_experience: mandat?.niveau_experience,
      secteur_activite: mandat?.secteur_activite || "",
      taille_entreprise: mandat?.taille_entreprise,
      mode_travail: mandat?.mode_travail,
      niveau_etudes: mandat?.niveau_etudes,
      langues_requises: mandat?.langues_requises || [],
      avantages: mandat?.avantages || [],
      statut: mandat?.statut || "ouvert",
      salaire_min: mandat?.salaire_min,
      salaire_max: mandat?.salaire_max,
      localisation: mandat?.localisation || "",
      competences_requises: mandat?.competences_requises || "",
      competences_souhaitees: mandat?.competences_souhaitees || "",
      date_debut: mandat?.date_debut || "",
      priorite: mandat?.priorite || "normale",
      nombre_postes: mandat?.nombre_postes || 1,
      entreprise_id: mandat?.entreprise_id || preSelectedClientId || "",
    },
  });

  // Reset form when mandat changes
  useEffect(() => {
    if (mandat) {
      const resetData = {
        titre: mandat.titre,
        description: mandat.description || "",
        type_contrat: mandat.type_contrat,
        type_poste: mandat.type_poste,
        niveau_experience: mandat.niveau_experience,
        secteur_activite: mandat.secteur_activite || "",
        taille_entreprise: mandat.taille_entreprise,
        mode_travail: mandat.mode_travail,
        niveau_etudes: mandat.niveau_etudes,
        langues_requises: mandat.langues_requises || [],
        avantages: mandat.avantages || [],
        statut: mandat.statut || "ouvert",
        salaire_min: mandat.salaire_min,
        salaire_max: mandat.salaire_max,
        localisation: mandat.localisation || "",
        competences_requises: mandat.competences_requises || "",
        competences_souhaitees: mandat.competences_souhaitees || "",
        date_debut: mandat.date_debut || "",
        priorite: mandat.priorite || "normale",
        nombre_postes: mandat.nombre_postes || 1,
        entreprise_id: mandat.entreprise_id,
      };
      form.reset(resetData);
      setSelectedLanguages(mandat.langues_requises || []);
      setSelectedBenefits(mandat.avantages || []);
    } else {
      const resetData = {
        titre: "",
        description: "",
        type_contrat: undefined,
        type_poste: undefined,
        niveau_experience: undefined,
        secteur_activite: "",
        taille_entreprise: undefined,
        mode_travail: undefined,
        niveau_etudes: undefined,
        langues_requises: [],
        avantages: [],
        statut: "ouvert" as const,
        salaire_min: undefined,
        salaire_max: undefined,
        localisation: "",
        competences_requises: "",
        competences_souhaitees: "",
        date_debut: "",
        priorite: "normale" as const,
        nombre_postes: 1,
        entreprise_id: preSelectedClientId || "",
      };
      form.reset(resetData);
      setSelectedLanguages([]);
      setSelectedBenefits([]);
    }
  }, [mandat, form, preSelectedClientId]);

  const handleSubmit = async (data: MandatFormData) => {
    try {
      // Mettre à jour les arrays avec les valeurs sélectionnées
      const submitData = {
        ...data,
        langues_requises: selectedLanguages,
        avantages: selectedBenefits,
      };
      await onSubmit(submitData);
      if (mode === "create") {
        form.reset();
        setSelectedLanguages([]);
        setSelectedBenefits([]);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const addLanguage = (language: string) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const removeLanguage = (language: string) => {
    setSelectedLanguages(selectedLanguages.filter((l) => l !== language));
  };

  const addBenefit = (benefit: string) => {
    if (!selectedBenefits.includes(benefit)) {
      setSelectedBenefits([...selectedBenefits, benefit]);
    }
  };

  const removeBenefit = (benefit: string) => {
    setSelectedBenefits(selectedBenefits.filter((b) => b !== benefit));
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
            : "Créez une offre d'emploi professionnelle"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Section 1: Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Informations de base
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="titre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du poste *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Développeur Full Stack Senior"
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
                            <span>
                              {clients.find(
                                (client) => client.id === field.value
                              )?.nom || "Client introuvable"}
                            </span>
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
                name="secteur_activite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secteur d&apos;activité</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un secteur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SECTORS.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
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
                name="statut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut du mandat</FormLabel>
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
            </div>
          </div>

          {/* Section 2: Type d'emploi */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Type d&apos;emploi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="type_contrat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de contrat</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Type de contrat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(CONTRACT_TYPES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
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
                name="type_poste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de poste</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Type de poste" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(JOB_TYPES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
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
                name="mode_travail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de travail</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Mode de travail" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(WORK_MODES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section 3: Profil recherché */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Profil recherché
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="niveau_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau d&apos;expérience</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Niveau d'expérience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(EXPERIENCE_LEVELS).map(
                          ([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="niveau_etudes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau d&apos;études</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Niveau d'études" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(EDUCATION_LEVELS).map(
                          ([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taille_entreprise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taille entreprise</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Taille entreprise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(COMPANY_SIZES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section 4: Compétences et langues */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Compétences et langues
            </h3>

            {/* Compétences requises */}
            <FormField
              control={form.control}
              name="competences_requises"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compétences requises</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les compétences requises pour ce poste..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Compétences souhaitées */}
            <FormField
              control={form.control}
              name="competences_souhaitees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compétences souhaitées</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les compétences souhaitées pour ce poste..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Langues requises */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Langues requises
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedLanguages.map((language) => (
                  <span
                    key={language}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border"
                  >
                    {language}
                    <button
                      type="button"
                      onClick={() => removeLanguage(language)}
                      className="ml-2 text-gray-600 hover:text-gray-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <Select onValueChange={addLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter une langue" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.filter(
                    (lang) => !selectedLanguages.includes(lang)
                  ).map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section 5: Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Conditions et localisation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="salaire_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salaire minimum (k€/an)</FormLabel>
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
                    <FormLabel>Salaire maximum (k€/an)</FormLabel>
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
                name="localisation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localisation</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Paris, Lyon, Remote" {...field} />
                    </FormControl>
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
          </div>

          {/* Section 6: Avantages */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Avantages proposés
            </h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedBenefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border"
                  >
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeBenefit(benefit)}
                      className="ml-2 text-gray-600 hover:text-gray-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <Select onValueChange={addBenefit}>
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter un avantage" />
                </SelectTrigger>
                <SelectContent>
                  {BENEFITS.filter(
                    (benefit) => !selectedBenefits.includes(benefit)
                  ).map((benefit) => (
                    <SelectItem key={benefit} value={benefit}>
                      {benefit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section 7: Dates et priorité */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Planning et priorité
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date_debut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début souhaitée</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PRIORITY_LEVELS).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section 8: Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Description du poste
            </h3>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description détaillée</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez le poste, les missions principales, l'environnement de travail, les perspectives d'évolution..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={isSubmitting || form.formState.isSubmitting}
              className="bg-black/90 hover:bg-black"
            >
              {isSubmitting || form.formState.isSubmitting
                ? "En cours..."
                : mode === "edit"
                ? "Modifier le mandat"
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
