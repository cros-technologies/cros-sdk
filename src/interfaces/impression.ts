export interface Impression {
    readonly walletAddress: string;
    readonly campaignId: string;
    readonly adContentId: string;
    readonly adAssestId: string;
    readonly metaverseAssestId: string;
    readonly bidId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  }