'use client';

import styled from 'styled-components';
import { FILTER_OPTIONS } from '@/constants';
import { media } from '@/styles';
import type { FilterCounts, FilterType } from '@/types';
import { FilterButton } from '../FilterButton';

interface FilterBarProps {
  activeFilter: FilterType;
  counts: FilterCounts;
  onFilterChange: (filter: FilterType) => void;
}

const Container = styled.nav`
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};

  ${media.sm} {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const ButtonWrapper = styled.div`
  ${media.sm} {
    flex: 1;
    min-width: 120px;
    max-width: 200px;
  }
`;

export function FilterBar({ activeFilter, counts, onFilterChange }: FilterBarProps) {
  return (
    <Container role="tablist" aria-label="Match filters">
      <Title>Filters</Title>
      <ButtonGroup>
        {FILTER_OPTIONS.map((option) => (
          <ButtonWrapper key={option.id}>
            <FilterButton
              label={option.label}
              count={counts[option.id]}
              isActive={activeFilter === option.id}
              onClick={() => onFilterChange(option.id)}
            />
          </ButtonWrapper>
        ))}
      </ButtonGroup>
    </Container>
  );
}
