"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, MessageSquare, Users, Send } from "lucide-react";
import Image from "next/image";

type Message = {
  id: number;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function TalentsGPTPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "assistant",
      content:
        "Bonjour ! Décrivez-moi la personne que vous recherchez et je vous aiderai à trouver les meilleurs talents.",
      timestamp: new Date(),
    },
  ]);

  const breadcrumbs = [
    { label: "Chat", href: "/dashboard/chat" },
    { label: "Talents GPT" },
  ];

  const quickActions = [
    {
      icon: Users,
      title: "Quel profil cherchez-vous ?",
    },
    {
      icon: Search,
      title: "Faire une recherche avancée",
    },
    {
      icon: FileText,
      title: "Rédiger une offre",
    },
    {
      icon: MessageSquare,
      title: "Rédiger une communication",
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simuler une réponse de l'assistant
    setTimeout(() => {
      const assistantResponse: Message = {
        id: messages.length + 2,
        type: "assistant",
        content:
          "Je comprends votre demande. Laissez-moi analyser les profils disponibles et vous proposer les meilleurs candidats correspondant à vos critères.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantResponse]);
    }, 1000);
  };

  const handleQuickAction = (action: (typeof quickActions)[0]) => {
    const actionMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: action.title,
      timestamp: new Date(),
    };
    setMessages([...messages, actionMessage]);
  };

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-3 mt-8 pt-6">
          <div className="flex items-center justify-center mb-3">
            <Image
              src="/logo.png"
              alt="Logo Optimal"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            TalentsGPT pour Optimal
          </h1>

          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Trouvez les talents que vous cherchez, rédigez vos contenus et
            pilotez votre activité.{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              Découvrez comment ça fonctionne
            </a>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-1">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto px-3 py-2 flex items-center space-x-1.5 rounded-none border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              onClick={() => handleQuickAction(action)}
            >
              <action.icon className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                {action.title}
              </span>
            </Button>
          ))}
        </div>

        {/* Chat Interface */}
        <Card className="border shadow-sm">
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      msg.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.type === "assistant" && (
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-5 h-5  rounded-full flex items-center justify-center">
                          <Image
                            src="/logo.png"
                            alt="Logo"
                            width={121}
                            height={21}
                            className="text-white"
                          />
                        </div>
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t p-3">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre besoin..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
