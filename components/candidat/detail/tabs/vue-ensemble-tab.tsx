import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatters";
import {
  Briefcase,
  GraduationCap,
  Target,
  Clock,
  Activity,
  Brain,
  Search,
  RefreshCw,
  Eye,
} from "lucide-react";

interface VueEnsembleTabProps {
  candidat: Candidat;
}

export function VueEnsembleTab({ candidat }: VueEnsembleTabProps) {
  return (
    <div className="space-y-6">
      {/* 3 cartes principales côte à côte */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Match actif */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Matchs actifs
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {candidat.candidatures?.filter(
                    (c) => c.statut === "entretien"
                  )?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match détecté */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Search className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Matchs détectés
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {candidat.analyse_ia?.competences_detectees?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dernière mise à jour */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <RefreshCw className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Dernière MAJ
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {candidat.updated_at
                    ? formatDate(candidat.updated_at)
                    : formatDate(candidat.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2 cartes Analyse IA et Mémoire IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Talents GPT */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Talents GPT
            </CardTitle>
          </CardHeader>
          <CardContent>
            {candidat.analyse_ia ? (
              <div className="space-y-4">
                {candidat.analyse_ia.competences_detectees &&
                  candidat.analyse_ia.competences_detectees.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Compétences détectées
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {candidat.analyse_ia.competences_detectees
                          .slice(0, 6)
                          .map((competence, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {competence}
                            </Badge>
                          ))}
                        {candidat.analyse_ia.competences_detectees.length >
                          6 && (
                          <Badge variant="outline" className="text-xs">
                            +
                            {candidat.analyse_ia.competences_detectees.length -
                              6}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                {candidat.analyse_ia.points_forts &&
                  candidat.analyse_ia.points_forts.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Points forts
                      </p>
                      <ul className="space-y-1">
                        {candidat.analyse_ia.points_forts
                          .slice(0, 3)
                          .map((point, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <span className="text-green-600 mt-1">•</span>
                              {point}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                {candidat.analyse_ia.derniere_analyse && (
                  <p className="text-xs text-gray-500">
                    Dernière analyse:{" "}
                    {formatDate(candidat.analyse_ia.derniere_analyse)}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Brain className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Aucune analyse IA disponible</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mémoire IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Mémoire IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            {candidat.memoire_ia ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Interactions récentes
                  </p>
                  <p className="text-sm text-gray-600">
                    {candidat.memoire_ia.interactions?.length || 0} interactions
                    enregistrées
                  </p>
                </div>

                {candidat.memoire_ia.derniere_mise_a_jour && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Dernière mise à jour
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(candidat.memoire_ia.derniere_mise_a_jour)}
                    </p>
                  </div>
                )}

                {candidat.memoire_ia.contenu && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Contenu
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {candidat.memoire_ia.contenu}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Aucune mémoire IA disponible</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activité récente et Veille - 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Candidatures récentes */}
              {candidat.candidatures && candidat.candidatures.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Candidatures
                  </h4>
                  <div className="space-y-2">
                    {candidat.candidatures
                      .slice(0, 3)
                      .map((candidature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {candidature.mandat?.titre ||
                                candidature.mandats?.titre ||
                                "Poste non spécifié"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {candidature.created_at
                                ? formatDate(candidature.created_at)
                                : "Date inconnue"}
                            </p>
                          </div>
                          <Badge
                            variant={
                              candidature.statut === "entretien"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {candidature.statut || "postule"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Expériences récentes */}
              {candidat.experiences && candidat.experiences.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Expériences
                  </h4>
                  <div className="space-y-2">
                    {candidat.experiences.slice(0, 2).map((exp, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <p className="text-sm font-medium text-gray-900">
                            {exp.poste}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          {exp.entreprise}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(exp.date_debut)} -{" "}
                          {exp.date_fin ? formatDate(exp.date_fin) : "Présent"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formations récentes */}
              {candidat.formations && candidat.formations.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Formations</h4>
                  <div className="space-y-2">
                    {candidat.formations.slice(0, 2).map((formation, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="h-4 w-4 text-green-600" />
                          <p className="text-sm font-medium text-gray-900">
                            {formation.diplome}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formation.etablissement}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(formation.date_debut)} -{" "}
                          {formatDate(formation.date_fin)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message si aucune activité */}
              {(!candidat.candidatures || candidat.candidatures.length === 0) &&
                (!candidat.experiences || candidat.experiences.length === 0) &&
                (!candidat.formations || candidat.formations.length === 0) && (
                  <div className="text-center text-gray-500 py-8">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Aucune activité récente</p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Veille */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              Veille
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mandats similaires */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Mandats similaires
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">
                      Infirmier(ère) DE - Service Cardiologie
                    </p>
                    <p className="text-xs text-gray-500">
                      CHU de Lyon • Publié il y a 2 jours
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      Match 85%
                    </Badge>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">
                      Infirmier(ère) spécialisé(e) - Urgences
                    </p>
                    <p className="text-xs text-gray-500">
                      Hôpital Privé • Publié il y a 3 jours
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      Match 78%
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Alertes de veille */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Alertes actives
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm font-medium text-gray-900">
                      Nouveaux postes en cardiologie
                    </p>
                    <p className="text-xs text-gray-500">
                      3 nouvelles offres cette semaine
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm font-medium text-gray-900">
                      Profil consulté
                    </p>
                    <p className="text-xs text-gray-500">
                      2 recruteurs ont consulté le profil
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommandations */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Recommandations
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Mettre à jour la section &quot;Compétences&quot; avec les
                      dernières certifications
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Ajouter des mots-clés liés aux soins intensifs pour
                      améliorer la visibilité
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
