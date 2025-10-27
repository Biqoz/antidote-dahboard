import { useState, useCallback } from 'react';
import { Candidat } from '@/types/candidat';
import { supabase } from '@/lib/supabase';

export function useCandidatData(initialCandidat: Candidat) {
  const [candidat, setCandidat] = useState<Candidat>(initialCandidat);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = useCallback(async (field: string, value: unknown) => {
    setIsLoading(true);
    
    try {
      // Mise à jour optimiste de l'état local
      setCandidat(prev => ({ 
        ...prev, 
        [field]: value,
        updated_at: new Date().toISOString()
      }));

      // Mise à jour en base de données
      const updateData = {
        [field]: value,
        updated_at: new Date().toISOString(),
      };
      console.log('Mise à jour en base:', updateData);
      
      const { error } = await supabase
        .from('profils')
        .update(updateData)
        .eq('id', candidat.id);

      if (error) {
        console.error('Erreur Supabase:', error);
        // Rollback en cas d'erreur
        setCandidat(prev => ({ ...prev, [field]: initialCandidat[field as keyof Candidat] }));
        throw error;
      }
      
      console.log('Mise à jour réussie en base de données');

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [candidat.id, initialCandidat]);

  const refreshCandidat = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profils')
        .select('*')
        .eq('id', candidat.id)
        .single();

      if (error) throw error;
      if (data) setCandidat(data);
    } catch (error) {
      console.error('Erreur lors du refresh:', error);
    }
  }, [candidat.id]);

  return {
    candidat,
    updateField,
    refreshCandidat,
    isLoading,
    setCandidat
  };
}