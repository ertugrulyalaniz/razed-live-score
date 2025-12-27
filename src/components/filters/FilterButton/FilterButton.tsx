'use client';

import styled from 'styled-components';

interface FilterButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const Button = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background: ${({ $isActive, theme }) => ($isActive ? theme.colors.ui.filterActive : 'transparent')};
  border: 1px solid
    ${({ $isActive, theme }) => ($isActive ? theme.colors.status.live : theme.colors.ui.border)};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.ui.filterActive};
    border-color: ${({ theme }) => theme.colors.ui.borderLight};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.status.live};
    outline-offset: 2px;
  }
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Count = styled.span<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 ${({ theme }) => theme.spacing[2]};
  background: ${({ $isActive, theme }) => ($isActive ? theme.colors.status.live : theme.colors.ui.filterBadge)};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  border-radius: ${({ theme }) => theme.borders.radius.sm};
`;

export function FilterButton({ label, count, isActive, onClick }: FilterButtonProps) {
  return (
    <Button
      $isActive={isActive}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      data-testid={`filter-${label.toLowerCase()}`}
    >
      <Label>{label}</Label>
      <Count $isActive={isActive}>{count}</Count>
    </Button>
  );
}
