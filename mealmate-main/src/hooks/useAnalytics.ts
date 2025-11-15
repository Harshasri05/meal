import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMealStats = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['meal_stats', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_meal_stats', {
        start_date: startDate,
        end_date: endDate,
      });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useWasteTrends = (days: number = 7) => {
  return useQuery({
    queryKey: ['waste_trends', days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_waste_trends', { days });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useTopEcoWarriors = (limit: number = 10) => {
  return useQuery({
    queryKey: ['top_eco_warriors', limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_eco_warriors', {
        limit_count: limit,
      });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useWasteLogs = (scheduleId?: string) => {
  return useQuery({
    queryKey: ['waste_logs', scheduleId],
    queryFn: async () => {
      let query = supabase
        .from('waste_logs')
        .select('*, meal_schedules(*, meals(*)), profiles(full_name)')
        .order('created_at', { ascending: false });

      if (scheduleId) {
        query = query.eq('schedule_id', scheduleId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [
        { count: totalStudents },
        { data: weekStats },
        { data: wasteLogs },
        { data: recentFeedback }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.rpc('get_meal_stats', { start_date: weekAgo, end_date: today }),
        supabase.from('waste_logs').select('weight_kg').gte('created_at', weekAgo),
        supabase.from('feedback').select('rating').gte('created_at', weekAgo)
      ]);

      const totalWaste = wasteLogs?.reduce((sum, log) => sum + Number(log.weight_kg), 0) || 0;
      const avgRating = recentFeedback && recentFeedback.length > 0
        ? recentFeedback.reduce((sum, f) => sum + f.rating, 0) / recentFeedback.length
        : 0;

      return {
        totalStudents: totalStudents || 0,
        weekStats: weekStats || [],
        totalWaste,
        avgRating: Math.round(avgRating * 10) / 10,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};
