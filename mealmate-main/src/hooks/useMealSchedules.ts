import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type MealSchedule = Database['public']['Tables']['meal_schedules']['Row'];
type MealScheduleInsert = Database['public']['Tables']['meal_schedules']['Insert'];
type MealScheduleUpdate = Database['public']['Tables']['meal_schedules']['Update'];

type MealScheduleWithMeal = MealSchedule & {
  meals: Database['public']['Tables']['meals']['Row'];
};

export const useMealSchedules = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['meal_schedules', startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('meal_schedules')
        .select('*, meals(*)')
        .eq('is_active', true)
        .order('scheduled_date', { ascending: true })
        .order('meal_type', { ascending: true });

      if (startDate) {
        query = query.gte('scheduled_date', startDate);
      }
      if (endDate) {
        query = query.lte('scheduled_date', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MealScheduleWithMeal[];
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useTodaySchedules = () => {
  const today = new Date().toISOString().split('T')[0];
  return useMealSchedules(today, today);
};

export const useWeekSchedules = () => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return useMealSchedules(
    today.toISOString().split('T')[0],
    nextWeek.toISOString().split('T')[0]
  );
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schedule: MealScheduleInsert) => {
      const { data, error } = await supabase
        .from('meal_schedules')
        .insert(schedule)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal_schedules'] });
      toast.success('Schedule created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create schedule: ${error.message}`);
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: MealScheduleUpdate }) => {
      const { data, error } = await supabase
        .from('meal_schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal_schedules'] });
      toast.success('Schedule updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update schedule: ${error.message}`);
    },
  });
};
