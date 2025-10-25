import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { CreateCandidatData, Candidat } from "@/types/candidat";
import { cn } from "@/lib/utils";

// Schéma de validation Zod
const candidatschema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(255, "Le nom est trop long"),
  prenom: z.string().min(1, "Le prénom est requis").max(255, "Le prénom est trop long"),
  adresse: z.string().optional(),
  ville: z.string().max(100, "Nom de ville trop long").optional(),
  code_postal: z.string().max(10, "Code postal trop long").optional(),
  pays: z.string().max(100, "Nom de pays trop long").optional(),
  telephone: z.string().max(20, "Numéro trop long").optional(),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().email().safeParse(val).success,
      {
        message: "Email invalide",
      }
    ),
  specialisation: z.string().max(255, "Spécialisation trop longue").optional(),
  niveau_experience: z.string().max(100, "Niveau d'expérience trop long").optional(),
  statut: z.string(),
});

type CandidatFormData = z.infer<typeof candidatschema>;

interface CandidatFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: CreateCandidatData) => Promise<void>;
  loading?: boolean;
  candidat?: Candidat; // Candidat à éditer (optionnel)
  mode?: "create" | "edit"; // Mode du formulaire
}

export function CandidatForm({
  isOpen,
  onToggle,
  onSubmit,
  loading = false,
  candidat,
  mode = "create",
}: CandidatFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CandidatFormData>({
    resolver: zodResolver(candidatschema),
    defaultValues: candidat
      ? {
          nom: candidat.nom,
          prenom: candidat.prenom,
          adresse: candidat.adresse || "",
          ville: candidat.ville || "",
          code_postal: candidat.code_postal || "",
          pays: candidat.pays || "",
          telephone: candidat.telephone || "",
          email: candidat.email || "",
          specialisation: candidat.specialisation || "",
          niveau_experience: candidat.niveau_experience || "",
          statut: candidat.statut,
        }
      : {
          nom: "",
          prenom: "",
          pays: "France",
          statut: "actif",
        },
    mode: "onChange", // Validation en temps réel
  });

  // Réinitialiser le formulaire quand le candidat change
  useEffect(() => {
    if (candidat) {
      reset({
        nom: candidat.nom,
        prenom: candidat.prenom,
        adresse: candidat.adresse || "",
        ville: candidat.ville || "",
        code_postal: candidat.code_postal || "",
        pays: candidat.pays || "",
        telephone: candidat.telephone || "",
        email: candidat.email || "",
        specialisation: candidat.specialisation || "",
        niveau_experience: candidat.niveau_experience || "",
        statut: candidat.statut,
      });
    } else {
      reset({
        nom: "",
        prenom: "",
        adresse: "",
        ville: "",
        code_postal: "",
        pays: "France",
        telephone: "",
        email: "",
        specialisation: "",
        niveau_experience: "",
        statut: "actif",
      });
    }
  }, [candidat, reset]);

  const handleFormSubmit: SubmitHandler<CandidatFormData> = async (data) => {
    try {
      setIsSubmitting(true);

      // Créer les données pour CreateCandidatData
      const cleanData: CreateCandidatData = {
        nom: data.nom,
        prenom: data.prenom,
        statut: data.statut,
        ...(data.adresse && data.adresse !== "" && { adresse: data.adresse }),
        ...(data.ville && data.ville !== "" && { ville: data.ville }),
        ...(data.code_postal &&
          data.code_postal !== "" && { code_postal: data.code_postal }),
        ...(data.pays && data.pays !== "" && { pays: data.pays }),
        ...(data.telephone &&
          data.telephone !== "" && { telephone: data.telephone }),
        ...(data.email && data.email !== "" && { email: data.email }),
        ...(data.specialisation &&
          data.specialisation !== "" && { specialisation: data.specialisation }),
        ...(data.niveau_experience &&
          data.niveau_experience !== "" && { niveau_experience: data.niveau_experience }),
      };

      await onSubmit(cleanData);
      reset();
      onToggle();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onToggle();
  };

  return (
    <div
      className={cn(
        "border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      )}
    >
      {/* Contenu du formulaire */}
      <div>
        <div className="px-6 pb-6 border-t border-gray-100">
          <form
            onSubmit={handleSubmit((data) => handleFormSubmit(data))}
            className="space-y-6 mt-6"
          >
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field error={errors.nom?.message}>
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  {...register("nom")}
                  placeholder="Ex: Dupont"
                  className={errors.nom ? "border-red-500" : ""}
                />
              </Field>

              <Field error={errors.prenom?.message}>
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  {...register("prenom")}
                  placeholder="Ex: Jean"
                  className={errors.prenom ? "border-red-500" : ""}
                />
              </Field>
            </div>

            {/* Spécialisation et expérience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field error={errors.specialisation?.message}>
                <Label htmlFor="specialisation">Spécialisation</Label>
                <Input
                  id="specialisation"
                  {...register("specialisation")}
                  placeholder="Ex: Développement web"
                  className={errors.specialisation ? "border-red-500" : ""}
                />
              </Field>

              <Field error={errors.niveau_experience?.message}>
                <Label htmlFor="niveau_experience">Niveau d&apos;expérience</Label>
                <Input
                  id="niveau_experience"
                  {...register("niveau_experience")}
                  placeholder="Ex: Senior, Junior"
                  className={errors.niveau_experience ? "border-red-500" : ""}
                />
              </Field>
            </div>

            {/* Statut */}
            <div className="grid grid-cols-1 gap-6">
              <Field error={errors.statut?.message}>
                <Label htmlFor="statut">Statut</Label>
                <select
                  id="statut"
                  {...register("statut")}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500",
                    errors.statut && "border-red-500"
                  )}
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="en_recherche">En recherche</option>
                  <option value="place">Placé</option>
                </select>
              </Field>
            </div>

            {/* Localisation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field error={errors.ville?.message}>
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  {...register("ville")}
                  placeholder="Ex: Paris"
                  className={errors.ville ? "border-red-500" : ""}
                />
              </Field>

              <Field error={errors.code_postal?.message}>
                <Label htmlFor="code_postal">Code postal</Label>
                <Input
                  id="code_postal"
                  {...register("code_postal")}
                  placeholder="Ex: 75001"
                  className={errors.code_postal ? "border-red-500" : ""}
                />
              </Field>

              <Field error={errors.pays?.message}>
                <Label htmlFor="pays">Pays</Label>
                <Input
                  id="pays"
                  {...register("pays")}
                  placeholder="Ex: France"
                  className={errors.pays ? "border-red-500" : ""}
                />
              </Field>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field error={errors.email?.message}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="contact@entreprise.com"
                  className={errors.email ? "border-red-500" : ""}
                />
              </Field>

              <Field error={errors.telephone?.message}>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  {...register("telephone")}
                  placeholder="01 23 45 67 89"
                  className={errors.telephone ? "border-red-500" : ""}
                />
              </Field>
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-1 gap-6">
              <Field error={errors.adresse?.message}>
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  {...register("adresse")}
                  placeholder="123 Rue de la Paix, Paris"
                  className={errors.adresse ? "border-red-500" : ""}
                />
              </Field>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <Button
                type="submit"
                disabled={isSubmitting || loading || !isValid}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting
                  ? mode === "edit"
                    ? "Modification..."
                    : "Enregistrement..."
                  : mode === "edit"
                  ? "Modifier"
                  : "Enregistrer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
