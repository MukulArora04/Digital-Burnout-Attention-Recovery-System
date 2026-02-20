import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Report, FocusScore } from '../backend';

export function useGetAllReports() {
  const { actor, isFetching } = useActor();

  return useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllReports();
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFocusScores() {
  const { actor, isFetching } = useActor();

  return useQuery<FocusScore[]>({
    queryKey: ['focusScores'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getFocusScores();
      } catch (error) {
        console.error('Failed to fetch focus scores:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActivityData() {
  const { actor, isFetching } = useActor();

  return useQuery<FocusScore[]>({
    queryKey: ['focusScores'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getFocusScores();
      } catch (error) {
        console.error('Failed to fetch activity data:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordFocusScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      distractionScore,
      tabSwitchCount,
      timeAway,
    }: {
      distractionScore: bigint;
      tabSwitchCount: bigint;
      timeAway: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      try {
        await actor.recordFocusScore(distractionScore, tabSwitchCount, timeAway);
      } catch (error) {
        console.error('Failed to record focus score:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focusScores'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });
}
