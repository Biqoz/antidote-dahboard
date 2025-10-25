import { redirect } from 'next/navigation';

export default function ChatPage() {
  // Redirection vers la page d'accueil du dashboard
  redirect('/dashboard');
}