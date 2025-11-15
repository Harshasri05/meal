import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

type MealConfirmation = Database['public']['Tables']['meal_confirmations']['Row'];
type MealConfirmationInsert = Database['public']['Tables']['meal_confirmations']['Insert'];
type PortionSize = Database['public']['Enums']['portion_size'];

const ECO_POINTS_MAP: Record<PortionSize, number> = {
  small: 5,
  medium: 2,
  large: 0,
};

export const useUserConfirmations = (userId?: string) => {
  return useQuery({
    queryKey: ['meal_confirmations', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('meal_confirmations')
        .select('*, meal_schedules(*, meals(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useScheduleConfirmations = (scheduleId: string) => {
  return useQuery({
    queryKey: ['schedule_confirmations', scheduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meal_confirmations')
        .select('*')
        .eq('schedule_id', scheduleId)
        .eq('status', 'confirmed');

      if (error) throw error;

      const stats = {
        total: data.length,
        small: data.filter(c => c.portion_size === 'small').length,
        medium: data.filter(c => c.portion_size === 'medium').length,
        large: data.filter(c => c.portion_size === 'large').length,
      };

      return stats;
    },
    refetchInterval: 30000,
  });
};

export const useCreateConfirmation = () => {
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();

  return useMutation({
    mutationFn: async (confirmation: Omit<MealConfirmationInsert, 'user_id' | 'eco_points_earned'>) => {
      if (!user) throw new Error('User not authenticated');

      const ecoPoints = ECO_POINTS_MAP[confirmation.portion_size || 'medium'];

      const { data, error } = await supabase
        .from('meal_confirmations')
        .insert({
          ...confirmation,
          user_id: user.id,
          eco_points_earned: ecoPoints,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meal_confirmations'] });
      queryClient.invalidateQueries({ queryKey: ['schedule_confirmations', data.schedule_id] });
      refreshProfile();
      toast.success(`Meal confirmed! +${data.eco_points_earned} EcoPoints earned`);
    },
    onError: (error: Error) => {
      if (error.message.includes('duplicate')) {
        toast.error('You have already confirmed this meal');
      } else {
        toast.error(`Failed to confirm meal: ${error.message}`);
      }
    },
  });
};

export const useUpdateConfirmation = () => {
  const queryClient = useQueryClient();
  const { refreshProfile } = useAuth();

  return useMutation({
    mutationFn: async ({
      id,
      portion_size,
      status
    }: {
      id: string;
      portion_size?: PortionSize;
      status?: Database['public']['Enums']['confirmation_status']
    }) => {
      const updates: any = {};

      if (portion_size) {
        updates.portion_size = portion_size;
        updates.eco_points_earned = ECO_POINTS_MAP[portion_size];
      }

      if (status) {
        updates.status = status;
      }

      const { data, error } = await supabase
        .from('meal_confirmations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meal_confirmations'] });
      queryClient.invalidateQueries({ queryKey: ['schedule_confirmations', data.schedule_id] });
      refreshProfile();
      toast.success('Confirmation updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update confirmation: ${error.message}`);
    },
  });
};

export const useCancelConfirmation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('meal_confirmations')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meal_confirmations'] });
      queryClient.invalidateQueries({ queryKey: ['schedule_confirmations', data.schedule_id] });
      toast.success('Meal confirmation cancelled');
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel confirmation: ${error.message}`);
    },
  });
};
