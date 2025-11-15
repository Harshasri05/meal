import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Meal = Database['public']['Tables']['meals']['Row'];
type MealInsert = Database['public']['Tables']['meals']['Insert'];
type MealUpdate = Database['public']['Tables']['meals']['Update'];

export const useMeals = (isActive: boolean = true) => {
  return useQuery({
    queryKey: ['meals', isActive],
    queryFn: async () => {
      let query = supabase
        .from('meals')
        .select('*')
        .order('created_at', { ascending: false });

      if (isActive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Meal[];
    },
  });
};

export const useMeal = (id: string | undefined) => {
  return useQuery({
    queryKey: ['meals', id],
    queryFn: async () => {
      if (!id) throw new Error('Meal ID is required');
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Meal;
    },
    enabled: !!id,
  });
};

export const useCreateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meal: MealInsert) => {
      const { data, error } = await supabase
        .from('meals')
        .insert(meal)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      toast.success('Meal created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create meal: ${error.message}`);
    },
  });
};

export const useUpdateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: MealUpdate }) => {
      const { data, error } = await supabase
        .from('meals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['meals', data.id] });
      toast.success('Meal updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update meal: ${error.message}`);
    },
  });
};

export const useDeleteMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('meals')
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      toast.success('Meal deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete meal: ${error.message}`);
    },
  });
};
