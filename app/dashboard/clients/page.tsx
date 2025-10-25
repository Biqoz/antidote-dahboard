import { redirect } from 'next/navigation';

export default function EntreprisePage() {
  // Redirection vers la page d'accueil du dashboard
  redirect('/dashboard');
}