"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  Target,
  Activity,
  Search,
  ArrowUpRight,
} from "lucide-react";

export default function Page() {
  const breadcrumbs = [{ label: "Dashboard" }];

  // Données pour les graphiques
  const chartData = {
    monthly: [
      { month: "Jan", candidatures: 45, entretiens: 28, placements: 12 },
      { month: "Fév", candidatures: 52, entretiens: 31, placements: 15 },
      { month: "Mar", candidatures: 48, entretiens: 29, placements: 14 },
      { month: "Avr", candidatures: 61, entretiens: 38, placements: 18 },
      { month: "Mai", candidatures: 55, entretiens: 33, placements: 16 },
      { month: "Juin", candidatures: 67, entretiens: 42, placements: 21 },
    ],
    sectors: [
      { name: "Soins infirmiers", value: 45, color: "bg-blue-500" },
      { name: "Aide-soignant", value: 30, color: "bg-green-500" },
      { name: "Paramédical", value: 25, color: "bg-purple-500" },
    ],
  };

  const stats = {
    candidaturesEnCours: 24,
    mandatsActifs: 8,
    candidatsTotal: 342,
    tauxReussite: 78,
  };

  const candidaturesRecentes = [
    {
      id: 1,
      candidat: "Marie Dubois",
      poste: "Infirmière DE",
      statut: "entretien",
    },
    {
      id: 2,
      candidat: "Pierre Martin",
      poste: "Aide-soignant",
      statut: "en_cours",
    },
    {
      id: 3,
      candidat: "Sophie Laurent",
      poste: "Kinésithérapeute",
      statut: "postule",
    },
  ];

  const alertesVeille = [
    {
      id: 1,
      titre: "Nouveau mandat",
      description: "CHU de Marseille",
      priorite: "haute",
    },
    {
      id: 2,
      titre: "Profil consulté",
      description: "5 consultations",
      priorite: "moyenne",
    },
    {
      id: 3,
      titre: "Match détecté",
      description: "3 nouveaux matchs",
      priorite: "haute",
    },
  ];

  const getStatutBadge = (statut: string) => {
    const variants = {
      entretien: "bg-emerald-50 text-emerald-700 border-emerald-200",
      en_cours: "bg-blue-50 text-blue-700 border-blue-200",
      postule: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return (
      <Badge className={`${variants[statut as keyof typeof variants]} border`}>
        {statut}
      </Badge>
    );
  };

  const getPrioriteBadge = (priorite: string) => {
    const variants = {
      haute: "bg-red-50 text-red-700 border-red-200",
      moyenne: "bg-orange-50 text-orange-700 border-orange-200",
    };
    return (
      <Badge
        className={`${variants[priorite as keyof typeof variants]} border`}
      >
        {priorite}
      </Badge>
    );
  };

  // Graphique en barres simple
  const BarChart = ({ data }: { data: typeof chartData.monthly }) => (
    <div className="flex items-end justify-between h-32 gap-1">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-1 flex-1">
          <div className="flex flex-col items-center gap-0.5 w-full">
            <div
              className="w-full bg-blue-500 rounded-t-sm opacity-80"
              style={{ height: `${(item.candidatures / 70) * 80}px` }}
            />
            <div
              className="w-full bg-green-500 rounded-t-sm opacity-80"
              style={{ height: `${(item.entretiens / 70) * 60}px` }}
            />
            <div
              className="w-full bg-purple-500 rounded-t-sm opacity-80"
              style={{ height: `${(item.placements / 70) * 40}px` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{item.month}</span>
        </div>
      ))}
    </div>
  );

  // Graphique en secteurs simple
  const PieChart = ({ data }: { data: typeof chartData.sectors }) => (
    <div className="flex items-center justify-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const total = data.reduce((sum, d) => sum + d.value, 0);
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage * 2.51} 251`;
            const strokeDashoffset =
              index === 0
                ? 0
                : -data
                    .slice(0, index)
                    .reduce((sum, d) => sum + (d.value / total) * 251, 0);

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={item.color.replace("bg-", "#").replace("-500", "")}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="opacity-80"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="h-[calc(100vh-4rem)] flex flex-col gap-4 p-4 overflow-hidden">
        {/* En-tête compact */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Vue d&apos;ensemble de votre activité RH
            </p>
          </div>
        </div>

        {/* Statistiques principales - plus compactes */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              icon: Briefcase,
              label: "Candidatures",
              value: stats.candidaturesEnCours,
              change: "+12%",
              color: "text-blue-600",
            },
            {
              icon: CheckCircle,
              label: "Mandats actifs",
              value: stats.mandatsActifs,
              change: "+2",
              color: "text-emerald-600",
            },
            {
              icon: Users,
              label: "Candidats",
              value: stats.candidatsTotal,
              change: "+12",
              color: "text-purple-600",
            },
            {
              icon: TrendingUp,
              label: "Taux réussite",
              value: `${stats.tauxReussite}%`,
              change: "+5%",
              color: "text-orange-600",
            },
          ].map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-emerald-600">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contenu principal - optimisé pour la hauteur */}
        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Candidatures en cours */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Candidatures en cours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {candidaturesRecentes.map((candidature) => (
                <div
                  key={candidature.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {candidature.candidat}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {candidature.poste}
                    </p>
                  </div>
                  {getStatutBadge(candidature.statut)}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
              >
                Voir tout
              </Button>
            </CardContent>
          </Card>

          {/* Statistiques avec graphiques */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Graphique en barres */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Évolution mensuelle
                </h4>
                <BarChart data={chartData.monthly} />
                <div className="flex justify-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">
                      Candidatures
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">
                      Entretiens
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">
                      Placements
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphique en secteurs */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Répartition secteurs
                </h4>
                <div className="flex items-center gap-4">
                  <PieChart data={chartData.sectors} />
                  <div className="space-y-1 flex-1">
                    {chartData.sectors.map((sector, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${sector.color}`}
                          ></div>
                          <span className="text-xs text-muted-foreground">
                            {sector.name}
                          </span>
                        </div>
                        <span className="text-xs font-medium">
                          {sector.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Veille */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4 text-indigo-600" />
                Veille
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alertesVeille.map((alerte) => (
                <div key={alerte.id} className="p-2 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {alerte.titre.includes("Nouveau") && (
                        <Target className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      )}
                      {alerte.titre.includes("Profil") && (
                        <Activity className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                      )}
                      {alerte.titre.includes("Match") && (
                        <Search className="h-3 w-3 text-purple-600 flex-shrink-0" />
                      )}
                      <span className="text-xs font-medium truncate">
                        {alerte.titre}
                      </span>
                    </div>
                    {getPrioriteBadge(alerte.priorite)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {alerte.description}
                  </p>
                </div>
              ))}

              <div className="pt-2 border-t space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Actions
                </h4>
                {[
                  { icon: Search, label: "Rechercher" },
                  { icon: Target, label: "Nouveau mandat" },
                  { icon: Eye, label: "Configurer" },
                ].map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-7 text-xs"
                  >
                    <action.icon className="h-3 w-3 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
