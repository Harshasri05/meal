import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

type Feedback = Database['public']['Tables']['feedback']['Row'];
type FeedbackInsert = Database['public']['Tables']['feedback']['Insert'];

export const useUserFeedback = (userId?: string) => {
  return useQuery({
    queryKey: ['feedback', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('feedback')
        .select('*, meals(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useMealFeedback = (mealId: string) => {
  return useQuery({
    queryKey: ['meal_feedback', mealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*, profiles(full_name)')
        .eq('meal_id', mealId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();

  return useMutation({
    mutationFn: async (feedback: Omit<FeedbackInsert, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('feedback')
        .insert({
          ...feedback,
          user_id: user.id,
          eco_points_earned: 5,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      refreshProfile();
      toast.success('Thank you for your feedback! +5 EcoPoints earned');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit feedback: ${error.message}`);
    },
  });
};

export const useRecentFeedback = (limit: number = 10) => {
  return useQuery({
    queryKey: ['recent_feedback', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*, profiles(full_name), meals(name)')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
