import { useState, useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateClientData, Client } from "@/types/client";
import { cn } from "@/lib/utils";

// Liste des secteurs d'activité (basée sur Group Optimal)
const SECTEURS_ACTIVITE = [
  { value: "Médecine", label: "Médecine" },
  { value: "Industrie", label: "Industrie" },
  { value: "Construction", label: "Construction" },
  { value: "IT et Technologie", label: "IT et Technologie" },
  { value: "Ressources Humaines", label: "Ressources Humaines" },
  { value: "Consultants Business", label: "Consultants Business" },
  { value: "Autre", label: "Autre" },
];

// Liste des pays disponibles avec préfixes téléphoniques
const COUNTRIES = [
  { value: "BE", label: "Belgique", prefix: "+32" },
  { value: "FR", label: "France", prefix: "+33" },
  { value: "DE", label: "Allemagne", prefix: "+49" },
  { value: "NL", label: "Pays-Bas", prefix: "+31" },
  { value: "LU", label: "Luxembourg", prefix: "+352" },
  { value: "IT", label: "Italie", prefix: "+39" },
  { value: "ES", label: "Espagne", prefix: "+34" },
  { value: "PT", label: "Portugal", prefix: "+351" },
  { value: "AT", label: "Autriche", prefix: "+43" },
  { value: "CH", label: "Suisse", prefix: "+41" },
  { value: "IE", label: "Irlande", prefix: "+353" },
  { value: "DK", label: "Danemark", prefix: "+45" },
  { value: "SE", label: "Suède", prefix: "+46" },
  { value: "NO", label: "Norvège", prefix: "+47" },
  { value: "FI", label: "Finlande", prefix: "+358" },
  { value: "PL", label: "Pologne", prefix: "+48" },
  { value: "CZ", label: "République tchèque", prefix: "+420" },
  { value: "HU", label: "Hongrie", prefix: "+36" },
  { value: "SK", label: "Slovaquie", prefix: "+421" },
  { value: "SI", label: "Slovénie", prefix: "+386" },
  { value: "HR", label: "Croatie", prefix: "+385" },
  { value: "RO", label: "Roumanie", prefix: "+40" },
  { value: "BG", label: "Bulgarie", prefix: "+359" },
  { value: "GR", label: "Grèce", prefix: "+30" },
  { value: "CY", label: "Chypre", prefix: "+357" },
  { value: "MT", label: "Malte", prefix: "+356" },
  { value: "EE", label: "Estonie", prefix: "+372" },
  { value: "LV", label: "Lettonie", prefix: "+371" },
  { value: "LT", label: "Lituanie", prefix: "+370" },
  { value: "GB", label: "Royaume-Uni", prefix: "+44" },
  { value: "US", label: "États-Unis", prefix: "+1" },
];

// Fonction pour obtenir le préfixe téléphonique selon le pays
const getPhonePrefix = (countryCode: string) => {
  const country = COUNTRIES.find((c) => c.value === countryCode);
  return country ? country.prefix : "";
};

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
  tel_fixe: z.string().max(20, "Numéro trop long").optional(),
  tel_portable: z.string().max(20, "Numéro trop long").optional(),
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
  contact_administratif: z
    .string()
    .max(255, "Nom du contact trop long")
    .optional(),
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
  const [selectedCountry, setSelectedCountry] = useState(client?.pays || "BE");

  // Fonction pour extraire le numéro sans préfixe
  const extractPhoneNumber = useCallback((fullNumber: string, countryCode: string): string => {
    if (!fullNumber) return "";
    const prefix = getPhonePrefix(countryCode);
    if (prefix && fullNumber.startsWith(prefix)) {
      return fullNumber.substring(prefix.length).trim();
    }
    return fullNumber;
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
    setValue,
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
          tel_fixe: extractPhoneNumber(
            client.tel_fixe || "",
            client.pays || ""
          ),
          tel_portable: extractPhoneNumber(
            client.tel_portable || "",
            client.pays || ""
          ),
          email: client.email || "",
          site_web: client.site_web || "",
          contact_administratif: client.contact_administratif || "",
          statut: client.statut || "prospect",
        }
      : {
          pays: "BE",
          statut: "prospect",
        },
    mode: "onChange", // Validation en temps réel
  });

  // Réinitialiser le formulaire quand le client change
  useEffect(() => {
    if (client && mode === "edit") {
      // Mode édition : pré-remplir avec les données du client
      const countryCode = client.pays || "BE";
      reset({
        nom: client.nom || "",
        secteur_activite: client.secteur_activite || "",
        adresse: client.adresse || "",
        ville: client.ville || "",
        code_postal: client.code_postal || "",
        pays: countryCode,
        tel_fixe: extractPhoneNumber(client.tel_fixe || "", countryCode),
        tel_portable: extractPhoneNumber(
          client.tel_portable || "",
          countryCode
        ),
        email: client.email || "",
        site_web: client.site_web || "",
        contact_administratif: client.contact_administratif || "",
        statut: client.statut || "prospect",
      });
    } else {
      // Mode création : réinitialiser avec les valeurs par défaut
      reset({
        nom: "",
        secteur_activite: "",
        adresse: "",
        ville: "",
        code_postal: "",
        pays: "BE",
        tel_fixe: "",
        tel_portable: "",
        email: "",
        site_web: "",
        contact_administratif: "",
        statut: "prospect",
      });
    }
  }, [client, mode, reset, extractPhoneNumber]);

  const handleFormSubmit: SubmitHandler<ClientFormData> = async (data) => {
    try {
      setIsSubmitting(true);

      // Nettoyer les données avant envoi
      // Obtenir le préfixe du pays sélectionné
      const phonePrefix = getPhonePrefix(data.pays || "");

      const cleanedData: CreateClientData = {
        nom: data.nom.trim(),
        statut: data.statut!,
        secteur_activite: data.secteur_activite?.trim() || undefined,
        adresse: data.adresse?.trim() || undefined,
        ville: data.ville?.trim() || undefined,
        code_postal: data.code_postal?.trim() || undefined,
        pays: data.pays?.trim() || undefined,
        tel_fixe: data.tel_fixe?.trim()
          ? `${phonePrefix} ${data.tel_fixe.trim()}`
          : undefined,
        tel_portable: data.tel_portable?.trim()
          ? `${phonePrefix} ${data.tel_portable.trim()}`
          : undefined,
        email: data.email?.trim() || undefined,
        site_web: data.site_web?.trim() || undefined,
        contact_administratif: data.contact_administratif?.trim() || undefined,
      };

      await onSubmit(cleanedData);
      onToggle();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleCancel = () => {
    if (mode === "create") {
      reset({
        pays: "BE",
        statut: "prospect",
      });
    } else {
      // En mode édition, restaurer les valeurs originales du client
      const countryCode = client?.pays || "";
      reset({
        nom: client?.nom || "",
        secteur_activite: client?.secteur_activite || "",
        adresse: client?.adresse || "",
        ville: client?.ville || "",
        code_postal: client?.code_postal || "",
        pays: countryCode,
        tel_fixe: extractPhoneNumber(client?.tel_fixe || "", countryCode),
        tel_portable: extractPhoneNumber(
          client?.tel_portable || "",
          countryCode
        ),
        email: client?.email || "",
        site_web: client?.site_web || "",
        contact_administratif: client?.contact_administratif || "",
        statut: client?.statut || "prospect",
      });
    }
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
                <Select
                  value={watch("secteur_activite") || ""}
                  onValueChange={(value) => setValue("secteur_activite", value)}
                >
                  <SelectTrigger
                    className={errors.secteur_activite ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Sélectionner un secteur d'activité" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTEURS_ACTIVITE.map((secteur) => (
                      <SelectItem key={secteur.value} value={secteur.value}>
                        {secteur.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Localisation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field error={errors.pays?.message}>
                <Label htmlFor="pays">Pays</Label>
                <Select
                  value={watch("pays")}
                  onValueChange={(value) => {
                    setValue("pays", value);
                    setSelectedCountry(value);
                  }}
                >
                  <SelectTrigger
                    className={errors.pays ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Sélectionner un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field error={errors.ville?.message}>
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  {...register("ville")}
                  placeholder="Ex: Bruxelles"
                  className={errors.ville ? "border-red-500" : ""}
                />
              </Field>

              <Field error={errors.code_postal?.message}>
                <Label htmlFor="code_postal">Code postal</Label>
                <Input
                  id="code_postal"
                  {...register("code_postal")}
                  placeholder="Ex: 1000"
                  className={errors.code_postal ? "border-red-500" : ""}
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
                  placeholder="123 Rue de la Paix"
                  className={errors.adresse ? "border-red-500" : ""}
                />
              </Field>
            </div>

            {/* Contact administratif */}
            <div className="grid grid-cols-1 gap-6">
              <Field error={errors.contact_administratif?.message}>
                <Label htmlFor="contact_administratif">
                  Contact administratif
                </Label>
                <Input
                  id="contact_administratif"
                  {...register("contact_administratif")}
                  placeholder="Jean Dupont - Directeur RH"
                  className={
                    errors.contact_administratif ? "border-red-500" : ""
                  }
                />
              </Field>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <Field error={errors.tel_fixe?.message}>
                <Label htmlFor="tel_fixe">Tél fixe</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                    {getPhonePrefix(selectedCountry)}
                  </span>
                  <Input
                    id="tel_fixe"
                    {...register("tel_fixe")}
                    placeholder="2 123 45 67"
                    className={cn(
                      "rounded-l-none",
                      errors.tel_fixe && "border-red-500"
                    )}
                  />
                </div>
              </Field>

              <Field error={errors.tel_portable?.message}>
                <Label htmlFor="tel_portable">Tél portable</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                    {getPhonePrefix(selectedCountry)}
                  </span>
                  <Input
                    id="tel_portable"
                    {...register("tel_portable")}
                    placeholder="4 123 45 67"
                    className={cn(
                      "rounded-l-none",
                      errors.tel_portable && "border-red-500"
                    )}
                  />
                </div>
              </Field>
            </div>

            {/* Site web */}
            <div className="grid grid-cols-1 gap-6">
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
