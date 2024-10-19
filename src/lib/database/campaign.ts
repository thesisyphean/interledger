import {pool} from "./index";
 
export interface Campaign {
    campaignId: string; // UUID
    userId: string; // UUID
    name: string;
    amount: number; // Decimal (18, 2)
    communityId: string; // UUID
    maxInterestRate: number; // Decimal (5, 2)
    description?: string; // Optional field
    dateCreated?: string; // ISO Date string (e.g., 'YYYY-MM-DD') default: CURRENT_DATE
    expiryDate: string; // ISO Date string (e.g., 'YYYY-MM-DD')
    repaymentDurationMonths: number;
    repaymentDelayMonths: number;
}

// get campaign by userid
export async function get_campaign_by_user(id: string): Promise<Campaign[]> {
    const result = await pool.query(`
            SELECT *
            FROM campaigns
            WHERE userId = $1;
        `, [id]);
  
    return result.rows as Campaign[];
}

// get campagn by lender
export async function get_campaign_by_lender(id: string): Promise<Campaign[]> {
    const result = await pool.query(`
            SELECT c.campaignId, c.userId, c.name, c.amount, c.communityId, c.maxInterestRate, c.description, c.dateCreated, c.expiryDate, c.repaymentDurationMonths, c.repaymentDelayMonths
            FROM campaigns c
            JOIN loans l ON c.userId = l.beneficiaryId
            WHERE l.lenderId = $1;
        `, [id]);
  
    return result.rows as Campaign[];
}

// get campaigns by community
export async function get_campaign_by_community(id: string): Promise<Campaign[]> {
    const result = await pool.query(`
            SELECT *
            FROM campaigns c
            WHERE c.communityId = $1;
        `, [id]);
  
    return result.rows as Campaign[];
}
