import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { CreateClientData, Client } from "@/types/client";
import { cn } from "@/lib/utils";

// Schéma de validation Zod
const clientSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(255, "Le nom est trop long"),
  secteur_activite: z
    .string()
    .max(255, "Secteur d'activité trop long")
    .optional(),
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
  site_web: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      {
        message: "URL invalide",
      }
    ),
  contact_principal: z.string().max(255, "Nom du contact trop long").optional(),
  notes: z.string().optional(),
  statut: z.enum(["actif", "inactif", "prospect"]),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: CreateClientData) => Promise<void>;
  loading?: boolean;
  client?: Client; // Client à éditer (optionnel)
  mode?: "create" | "edit"; // Mode du formulaire
}

export function ClientForm({
  isOpen,
  onToggle,
  onSubmit,
  loading = false,
  client,
  mode = "create",
}: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? {
          nom: client.nom,
          secteur_activite: client.secteur_activite || "",
          adresse: client.adresse || "",
          ville: client.ville || "",
          code_postal: client.code_postal || "",
          pays: client.pays || "",
          telephone: client.telephone || "",
          email: client.email || "",
          site_web: client.site_web || "",
          contact_principal: client.contact_principal || "",
          notes: client.notes || "",
          statut: client.statut || "prospect",
        }
      : {
          pays: "France",
          statut: "prospect",
        },
    mode: "onChange", // Validation en temps réel
  });

  // Réinitialiser le formulaire quand le client change
  useEffect(() => {
    if (client) {
      reset({
        nom: client.nom,
        secteur_activite: client.secteur_activite || "",
        adresse: client.adresse || "",
        ville: client.ville || "",
        code_postal: client.code_postal || "",
        pays: client.pays || "",
        telephone: client.telephone || "",
        email: client.email || "",
        site_web: client.site_web || "",
        contact_principal: client.contact_principal || "",
        notes: client.notes || "",
        statut: client.statut || "prospect",
      });
    } else {
      reset({
        nom: "",
        secteur_activite: "",
        adresse: "",
        ville: "",
        code_postal: "",
        pays: "France",
        telephone: "",
        email: "",
        site_web: "",
        contact_principal: "",
        notes: "",
        statut: "prospect",
      });
    }
  }, [client, reset]);

  const handleFormSubmit: SubmitHandler<ClientFormData> = async (data) => {
    try {
      setIsSubmitting(true);

      // Créer les données pour CreateClientData
      const cleanData: CreateClientData = {
        nom: data.nom,
        statut: data.statut,
        ...(data.secteur_activite &&
          data.secteur_activite !== "" && {
            secteur_activite: data.secteur_activite,
          }),
        ...(data.adresse && data.adresse !== "" && { adresse: data.adresse }),
        ...(data.ville && data.ville !== "" && { ville: data.ville }),
        ...(data.code_postal &&
          data.code_postal !== "" && { code_postal: data.code_postal }),
        ...(data.pays && data.pays !== "" && { pays: data.pays }),
        ...(data.telephone &&
          data.telephone !== "" && { telephone: data.telephone }),
        ...(data.email && data.email !== "" && { email: data.email }),
        ...(data.site_web &&
          data.site_web !== "" && { site_web: data.site_web }),
        ...(data.contact_principal &&
          data.contact_principal !== "" && {
            contact_principal: data.contact_principal,
          }),
        ...(data.notes && data.notes !== "" && { notes: data.notes }),
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
                <Label htmlFor="nom">Nom de l&apos;entreprise *</Label>
                <Input
                  id="nom"
                  {...register("nom")}
                  placeholder="Ex: Acme Corporation"
                  className={errors.nom ? "border-red-500" : ""}
                />
              </Field>

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
                  <option value="prospect">Prospect</option>
                  <option value="actif">Client actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </Field>
            </div>

            {/* Secteur d'activité */}
            <div className="grid grid-cols-1 gap-6">
              <Field error={errors.secteur_activite?.message}>
                <Label htmlFor="secteur_activite">
                  Secteur d&apos;activité
                </Label>
                <Input
                  id="secteur_activite"
                  {...register("secteur_activite")}
                  placeholder="Ex: Développement logiciel"
                  className={errors.secteur_activite ? "border-red-500" : ""}
                />
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

              <Field error={errors.contact_principal?.message}>
                <Label htmlFor="contact_principal">Contact principal</Label>
                <Input
                  id="contact_principal"
                  {...register("contact_principal")}
                  placeholder="Jean Dupont - Directeur RH"
                  className={errors.contact_principal ? "border-red-500" : ""}
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

            {/* Adresse et site web */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field error={errors.adresse?.message}>
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  {...register("adresse")}
                  placeholder="123 Rue de la Paix, Paris"
                  className={errors.adresse ? "border-red-500" : ""}
                />
              </Field>

              <Field error={errors.site_web?.message}>
                <Label htmlFor="site_web">Site web</Label>
                <Input
                  id="site_web"
                  {...register("site_web")}
                  placeholder="https://www.entreprise.com"
                  className={errors.site_web ? "border-red-500" : ""}
                />
              </Field>
            </div>

            {/* Notes */}
            <Field error={errors.notes?.message}>
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                {...register("notes")}
                rows={3}
                className={cn(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none",
                  errors.notes && "border-red-500"
                )}
                placeholder="Notes additionnelles..."
              />
            </Field>

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
