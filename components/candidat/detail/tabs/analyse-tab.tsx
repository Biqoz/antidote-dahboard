import React, { useState } from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  MessageCircle,
  Send,
  Calendar,
  Target,
  Briefcase,
  Star,
  TrendingUp,
  Bot,
} from "lucide-react";

interface AnalyseTabProps {
  candidat: Candidat;
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function AnalyseTab({ candidat }: AnalyseTabProps) {
  const analyseIA = candidat.analyse_ia;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: `Bonjour ! Je suis l'assistant IA pour l'analyse de ${candidat.prenom} ${candidat.nom}. Comment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const predefinedPrompts = [
    // Première colonne - Actions rapides
    {
      icon: Calendar,
      text: `Prendre un RDV`,
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      category: "action",
    },
    {
      icon: Send,
      text: `Envoyer un EMAIL`,
      color: "bg-green-100 text-green-700 hover:bg-green-200",
      category: "action",
    },
    {
      icon: Target,
      text: `Rechercher une information`,
      color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      category: "action",
    },
    // Deuxième colonne - Analyses
    {
      icon: Briefcase,
      text: `Analyser Compatibilité avec un mandat`,
      color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
      category: "analyse",
    },
    {
      icon: Star,
      text: `Quels sont les points forts`,
      color: "bg-pink-100 text-pink-700 hover:bg-pink-200",
      category: "analyse",
    },
    {
      icon: TrendingUp,
      text: `Recommandation pour améliorer le profil`,
      color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
      category: "analyse",
    },
  ];

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: `Je traite votre demande concernant "${content}". Cette fonctionnalité sera bientôt disponible !`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, aiResponse]);
    setInputMessage("");
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="space-y-4">
      {/* Analyse IA - Données existantes */}
      {analyseIA && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Talents GPT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Score global */}
              {analyseIA.score_global && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2 text-sm">
                    Score Global
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-blue-700">
                      {analyseIA.score_global}%
                    </div>
                    <Badge variant="outline" className="text-blue-600 text-xs">
                      IA
                    </Badge>
                  </div>
                </div>
              )}

              {/* Compétences détectées */}
              {analyseIA.competences_detectees &&
                analyseIA.competences_detectees.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-sm">
                      Compétences détectées
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {analyseIA.competences_detectees
                        .slice(0, 4)
                        .map((competence, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {competence}
                          </Badge>
                        ))}
                      {analyseIA.competences_detectees.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{analyseIA.competences_detectees.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

              {/* Points forts */}
              {analyseIA.points_forts && analyseIA.points_forts.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-sm text-green-700">
                    Points forts
                  </h4>
                  <div className="space-y-1">
                    {analyseIA.points_forts.slice(0, 2).map((point, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dernière analyse */}
            {analyseIA.derniere_analyse && (
              <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
                Dernière analyse:{" "}
                {new Date(analyseIA.derniere_analyse).toLocaleDateString(
                  "fr-FR"
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chat IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-purple-600" />
            Assistant IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <div className="h-48 overflow-y-auto space-y-2 p-3 bg-gray-50 rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-2 rounded-lg text-sm ${
                    message.type === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {message.type === "ai" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="h-3 w-3 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600">
                        Assistant IA
                      </span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.type === "user"
                        ? "text-purple-200"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => {
                if (e.key === "Enter" && inputMessage.trim()) {
                  handleSendMessage(inputMessage);
                }
              }}
            />
            <Button
              size="sm"
              onClick={() =>
                inputMessage.trim() && handleSendMessage(inputMessage)
              }
              disabled={!inputMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Prompts prédéfinis */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Action rapide</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Première colonne - Actions */}
              <div className="space-y-2">
                {predefinedPrompts
                  .filter((prompt) => prompt.category === "action")
                  .map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`justify-start h-auto p-2 text-left w-full ${prompt.color} border-0 text-xs`}
                      onClick={() => handlePromptClick(prompt.text)}
                    >
                      <prompt.icon className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{prompt.text}</span>
                    </Button>
                  ))}
              </div>

              {/* Deuxième colonne - Analyses */}
              <div className="space-y-2">
                {predefinedPrompts
                  .filter((prompt) => prompt.category === "analyse")
                  .map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`justify-start h-auto p-2 text-left w-full ${prompt.color} border-0 text-xs`}
                      onClick={() => handlePromptClick(prompt.text)}
                    >
                      <prompt.icon className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{prompt.text}</span>
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message si pas d'analyse */}
      {!analyseIA && (
        <Card>
          <CardContent className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-2">Aucune analyse IA disponible</p>
            <p className="text-sm text-gray-400">
              L&apos;analyse sera générée automatiquement lors de la prochaine
              mise à jour
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
