'use client';

import styled, { css } from 'styled-components';
import { StatusIndicator } from '@/components/ui';
import { media } from '@/styles';
import type { Match } from '@/types';
import { formatMatchTime, getLiveMinute, getMatchDisplayStatus } from '@/utils';

interface MatchCardProps {
  match: Match;
}

const Card = styled.article<{ $isLive: boolean }>`
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  transition: transform ${({ theme }) => theme.transitions.normal},
    box-shadow ${({ theme }) => theme.transitions.normal};

  ${media.md} {
    padding: ${({ theme }) => theme.spacing[8]};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  gap: ${({ theme }) => theme.spacing[1]};
`;

const Country = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;

const Competition = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StatusBadge = styled.span<{ $status: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: ${({ theme }) => theme.spacing[1]};

  ${({ $status, theme }) => {
    switch ($status) {
      case 'live':
        return css`
          color: ${theme.colors.status.live};
        `;
      case 'finished':
        return css`
          color: ${theme.colors.status.finished};
        `;
      case 'canceled':
        return css`
          color: ${theme.colors.status.canceled};
        `;
      default:
        return css`
          color: ${theme.colors.text.muted};
        `;
    }
  }}
`;

const ScoreSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${({ theme }) => theme.spacing[6]} 0;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const Score = styled.span`
  font-size: 3rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.primary};
  min-width: 50px;
  text-align: center;

  ${media.md} {
    font-size: 4rem;
    min-width: 70px;
  }
`;

const ScoreSeparator = styled.span`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};

  ${media.md} {
    font-size: 3rem;
  }
`;

const TeamsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const TeamName = styled.span<{ $align: 'left' | 'right' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: ${({ $align }) => $align};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;

  ${media.md} {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

function getStatusBadgeText(status: ReturnType<typeof getMatchDisplayStatus>, timestamp: number): string {
  switch (status) {
    case 'live':
      return 'LIVE';
    case 'finished':
      return 'ENDED';
    case 'canceled':
      return 'CANCELED';
    case 'halftime':
      return 'HALF TIME';
    default: {
      const date = new Date(timestamp * 1000);
      const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const day = date.getDate();
      const time = formatMatchTime(timestamp);
      return `${month} ${day}TH ${time}`;
    }
  }
}

export function MatchCard({ match }: MatchCardProps) {
  const displayStatus = getMatchDisplayStatus(match);
  const liveMinute = getLiveMinute(match.liveStatus);
  const isLive = displayStatus === 'live';
  const statusBadgeText = getStatusBadgeText(displayStatus, match.timestamp);

  const showZeroScore = displayStatus === 'canceled' || displayStatus === 'prematch';
  const homeScore = showZeroScore ? 0 : (match.homeScore.current ?? 0);
  const awayScore = showZeroScore ? 0 : (match.awayScore.current ?? 0);

  return (
    <Card $isLive={isLive} data-testid="match-card">
      <Header>
        <Country>{match.country}</Country>
        <Competition>{match.competition}</Competition>
        <StatusBadge $status={displayStatus}>{statusBadgeText}</StatusBadge>
      </Header>

      <ScoreSection>
        <ScoreContainer>
          <Score>{homeScore}</Score>
          <ScoreSeparator>-</ScoreSeparator>
          <Score>{awayScore}</Score>
        </ScoreContainer>
      </ScoreSection>

      <TeamsSection>
        <TeamName $align="left">{match.homeTeam.name}</TeamName>
        <StatusIndicator status={displayStatus} liveMinute={liveMinute} />
        <TeamName $align="right">{match.awayTeam.name}</TeamName>
      </TeamsSection>
    </Card>
  );
}
