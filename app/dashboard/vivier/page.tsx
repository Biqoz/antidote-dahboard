import { redirect } from 'next/navigation';

export default function VivierPage() {
  // Redirection vers la page d'accueil du dashboard
  redirect('/dashboard');
}