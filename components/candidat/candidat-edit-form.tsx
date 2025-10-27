"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, Link } from "lucide-react";
import { CandidatMandatLink } from "./candidat-mandat-link";
import { ProfilNotes } from "./profil-notes";
import { Candidat } from "@/types/candidat";
import { CandidatService } from "@/services/profils-service";

const candidatEditSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  code_postal: z.string().optional(),
  pays: z.string().optional(),
  specialisation: z.string().optional(),
  niveau_experience: z.string().optional(),
  salaire_souhaite: z.string().optional(),
  disponibilite: z.string().optional(),
  statut: z.string(),
  competences: z.string().optional(),
});

type CandidatEditFormData = z.infer<typeof candidatEditSchema>;

interface CandidatEditFormProps {
  candidat: Candidat;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STATUT_OPTIONS = [
  { value: "actif", label: "Actif" },
  { value: "inactif", label: "Inactif" },
  { value: "en_recherche", label: "En recherche" },
  { value: "place", label: "Placé" },
];

const EXPERIENCE_LEVELS = [
  { value: "junior", label: "Junior (0-2 ans)" },
  { value: "confirme", label: "Confirmé (3-5 ans)" },
  { value: "senior", label: "Senior (6-10 ans)" },
  { value: "expert", label: "Expert (10+ ans)" },
];

const DISPONIBILITE_OPTIONS = [
  { value: "immediat", label: "Immédiat" },
  { value: "1_mois", label: "1 mois" },
  { value: "2_mois", label: "2 mois" },
  { value: "3_mois", label: "3 mois ou plus" },
];

export function CandidatEditForm({
  candidat,
  onSuccess,
  onCancel,
}: CandidatEditFormProps) {
  const [showMandatLink, setShowMandatLink] = React.useState(false);

  const form = useForm<CandidatEditFormData>({
    resolver: zodResolver(candidatEditSchema),
    defaultValues: {
      nom: candidat.nom || "",
      prenom: candidat.prenom || "",
      email: candidat.email || "",
      telephone: candidat.telephone || "",
      adresse: candidat.adresse || "",
      ville: candidat.ville || "",
      code_postal: candidat.code_postal || "",
      pays: candidat.pays || "",
      specialisation: candidat.specialisation || "",
      niveau_experience: candidat.niveau_experience || "",
      salaire_souhaite: candidat.salaire_souhaite?.toString() || "",
      disponibilite: candidat.disponibilite || "",
      statut: candidat.statut || "actif",
      competences: Array.isArray(candidat.competences)
        ? candidat.competences.join(", ")
        : "",
    },
  });

  const onSubmit: SubmitHandler<CandidatEditFormData> = async (data) => {
    try {
      console.log("Mise à jour du candidat:", data);

      // Appel API réel pour mettre à jour le candidat avec les notes
      await CandidatService.updateWithNotes(candidat.id, data);

      onSuccess?.();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Modifier le profil</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowMandatLink(!showMandatLink)}
            className="ml-auto"
          >
            <Link className="h-4 w-4 mr-2" />
            {showMandatLink ? "Masquer liaison" : "Lier à un mandat"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Informations personnelles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de famille" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@exemple.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+33 1 23 45 67 89" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Adresse
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse complète" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ville"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Ville" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code_postal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input placeholder="75000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays</FormLabel>
                      <FormControl>
                        <Input placeholder="France" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Informations professionnelles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="specialisation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spécialisation</FormLabel>
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
                  name="niveau_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau d&apos;expérience</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le niveau" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EXPERIENCE_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
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
                  name="salaire_souhaite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salaire souhaité (€)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="45000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disponibilite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disponibilité</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la disponibilité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DISPONIBILITE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                      <FormLabel>Statut</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="competences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compétences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Listez les compétences principales (séparées par des virgules)"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* Section Notes */}
            <div className="space-y-4">
              <ProfilNotes
                profilId={candidat.id}
                notes={candidat.profil_notes || []}
                onNotesUpdate={onSuccess}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {form.formState.isSubmitting ? "Mise à jour..." : "Sauvegarder"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Annuler
              </Button>
            </div>
          </form>
        </Form>

        {/* Section liaison aux mandats */}
        {showMandatLink && (
          <div className="border-t pt-6">
            <CandidatMandatLink
              candidat={candidat}
              isOpen={showMandatLink}
              embedded={true}
              onClose={() => setShowMandatLink(false)}
              onSuccess={() => {
                setShowMandatLink(false);
                onSuccess?.();
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
