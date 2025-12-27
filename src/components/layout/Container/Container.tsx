'use client';

import styled from 'styled-components';
import { media } from '@/styles';

const StyledContainer = styled.div`
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};

  ${media.md} {
    padding: ${({ theme }) => theme.spacing[6]};
  }

  ${media.lg} {
    padding: ${({ theme }) => theme.spacing[8]};
  }
`;

interface ContainerProps {
  children: React.ReactNode;
}

export function Container({ children }: ContainerProps) {
  return <StyledContainer>{children}</StyledContainer>;
}
