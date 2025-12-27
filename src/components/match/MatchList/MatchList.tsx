'use client';

import styled from 'styled-components';
import { Spinner } from '@/components/ui';
import { media } from '@/styles';
import type { Match } from '@/types';
import { MatchCard } from '../MatchCard';

interface MatchListProps {
  matches: Match[];
  isLoading: boolean;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${media.xl} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const EmptySubtext = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

export function MatchList({ matches, isLoading }: MatchListProps) {
  if (isLoading) {
    return (
      <div aria-busy="true" aria-live="polite">
        <Spinner />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <EmptyState aria-live="polite">
        <EmptyText>No matches found</EmptyText>
        <EmptySubtext>Try selecting a different filter</EmptySubtext>
      </EmptyState>
    );
  }

  return (
    <Grid aria-live="polite" aria-busy={isLoading}>
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </Grid>
  );
}
