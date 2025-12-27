'use client';

import styled from 'styled-components';
import type { MatchDisplayStatus } from '@/types';

interface StatusIndicatorProps {
  status: MatchDisplayStatus;
  liveMinute?: string | null;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
`;

const CircleBase = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  position: relative;
`;

const EmptyCircle = styled(CircleBase)`
  border: 2px solid ${({ theme }) => theme.colors.text.muted};
  background: transparent;
`;

const FinishedCircle = styled(CircleBase)`
  border: 2px solid ${({ theme }) => theme.colors.status.finished};
  background: transparent;
  color: ${({ theme }) => theme.colors.status.finished};
`;

const LiveCircleWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
`;

const LiveCircleBg = styled.div`
  position: absolute;
  inset: 0;
  border: 2px solid ${({ theme }) => theme.colors.ui.border};
  border-radius: 50%;
`;

const LiveCircleProgress = styled.div<{ $progress: number }>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transform: rotate(90deg);
  background: conic-gradient(
    from -90deg,
    ${({ theme }) => theme.colors.status.live} ${({ $progress }) => $progress}%,
    transparent ${({ $progress }) => $progress}%
  );
  mask: radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 2px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 2px));
`;

const LiveMinuteText = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const HalftimeCircle = styled(CircleBase)`
  border: 2px solid ${({ theme }) => theme.colors.status.halftime};
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.status.halftime} 50%,
    transparent 50%
  );
  color: ${({ theme }) => theme.colors.status.halftime};
`;

function getProgressFromMinute(minute: string | null | undefined): number {
  if (!minute) return 50;
  const num = parseInt(minute.replace(/[^0-9]/g, ''), 10);
  if (Number.isNaN(num)) return 50;
  return Math.min((num / 90) * 100, 100);
}

export function StatusIndicator({ status, liveMinute }: StatusIndicatorProps) {
  switch (status) {
    case 'prematch':
      return (
        <Container data-testid="status-prematch">
          <EmptyCircle />
        </Container>
      );

    case 'live': {
      const progress = getProgressFromMinute(liveMinute);
      return (
        <Container data-testid="status-live">
          <LiveCircleWrapper>
            <LiveCircleBg />
            <LiveCircleProgress $progress={progress} />
            <LiveMinuteText>{liveMinute ? `${liveMinute}'` : 'LIVE'}</LiveMinuteText>
          </LiveCircleWrapper>
        </Container>
      );
    }

    case 'halftime':
      return (
        <Container data-testid="status-halftime">
          <HalftimeCircle>HT</HalftimeCircle>
        </Container>
      );

    case 'finished':
      return (
        <Container data-testid="status-finished">
          <FinishedCircle>FT</FinishedCircle>
        </Container>
      );

    case 'canceled':
      return (
        <Container data-testid="status-canceled">
          <EmptyCircle />
        </Container>
      );

    default:
      return null;
  }
}
