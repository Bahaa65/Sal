import { useInfiniteUserQuestionsQuery } from './useInfiniteUserQuestionsQuery';
import { useInfiniteUserAnswersQuery } from './useInfiniteUserAnswersQuery';
import { useInView } from 'react-intersection-observer';
import { useProfileQuery } from './useProfileQuery';

export function useProfilePageData(username?: string) {
  const { data: profile } = useProfileQuery();
  const effectiveUsername = username || profile?.username || '';

  const questionsInfinite = useInfiniteUserQuestionsQuery(effectiveUsername);
  const questions = questionsInfinite.data ? questionsInfinite.data.pages.flatMap(page => page.data) : [];
  const questionsLoading = questionsInfinite.isLoading;
  const fetchNextPage = questionsInfinite.fetchNextPage;
  const hasNextPage = questionsInfinite.hasNextPage;
  const isFetchingNextPage = questionsInfinite.isFetchingNextPage;
  const inViewHook = useInView({ triggerOnce: false });
  const ref = inViewHook.ref;
  const inView = inViewHook.inView;

  const answersInfinite = useInfiniteUserAnswersQuery(effectiveUsername);
  const answers = answersInfinite.data ? answersInfinite.data.pages.flatMap(page => page.data) : [];
  const answersLoading = answersInfinite.isLoading;
  const fetchNextAnswersPage = answersInfinite.fetchNextPage;
  const hasNextAnswersPage = answersInfinite.hasNextPage;
  const isFetchingNextAnswersPage = answersInfinite.isFetchingNextPage;
  const answersInViewHook = useInView({ triggerOnce: false });
  const answersRef = answersInViewHook.ref;
  const answersInView = answersInViewHook.inView;

  return {
    questions,
    questionsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ref,
    inView,
    answers,
    answersLoading,
    fetchNextAnswersPage,
    hasNextAnswersPage,
    isFetchingNextAnswersPage,
    answersRef,
    answersInView,
  };
} 