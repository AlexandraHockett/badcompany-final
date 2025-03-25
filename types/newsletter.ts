interface CampaignStats {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  openRate: string;
  clickRate: string;
  avgTimeToOpen: string;
}

interface Campaign {
  id: number;
  title: string;
  sentAt: string;
  status: string;
  totalRecipients?: number;
  opened?: number;
  clicked?: number;
  openRate?: string; // Adicione esta linha
  clickRate?: string; // Adicione esta linha
}

interface AnalyticsResponse {
  campaign: Campaign;
  stats: CampaignStats;
  timeframe: string;
}
