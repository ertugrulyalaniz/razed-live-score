'use client';

import { useEffect } from 'react';
import styled from 'styled-components';
import { FilterBar } from '@/components/filters';
import { Container, Header } from '@/components/layout';
import { MatchList } from '@/components/match';
import {
  selectActiveFilter,
  selectError,
  selectFilterCounts,
  selectFilteredMatches,
  selectIsLoading,
  useMatchStore,
} from '@/store';

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.status.live};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.status.live};
  text-align: center;
`;

const RetryButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background: ${({ theme }) => theme.colors.status.live};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.9;
  }
`;

export default function HomePage() {
  const matches = useMatchStore(selectFilteredMatches);
  const filterCounts = useMatchStore(selectFilterCounts);
  const activeFilter = useMatchStore(selectActiveFilter);
  const isLoading = useMatchStore(selectIsLoading);
  const error = useMatchStore(selectError);

  const fetchMatches = useMatchStore((state) => state.fetchMatches);
  const setActiveFilter = useMatchStore((state) => state.setActiveFilter);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <Container>
      <Header title="Live Scores" subtitle="Real-time match updates" />

      <FilterBar activeFilter={activeFilter} counts={filterCounts} onFilterChange={setActiveFilter} />

      {error ? (
        <ErrorMessage role="alert" aria-live="assertive">
          <p>{error}</p>
          <RetryButton onClick={fetchMatches}>Retry</RetryButton>
        </ErrorMessage>
      ) : (
        <MatchList matches={matches} isLoading={isLoading} />
      )}
    </Container>
  );
}
