import type { PageServerLoad } from '../$types';
import { getCampaignById, getCommunityCampaignsById } from "$lib/server/database/campaign";
import { error, redirect } from "@sveltejs/kit";
import { check_session } from "$lib/server/sessions";
import { getUserById } from "$lib/server/database/users";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const userUuid = check_session(cookies.get("session"));
  if (!userUuid) return redirect(303, "/login");

  const user = await getUserById(userUuid);
  if (!user) return redirect(303, "/login");

  const campaign = await getCommunityCampaignsById(params.slug);
  if (!campaign) error(404);

  return {
      campaignName: campaign.name,
      description: campaign.description,
      requiredAmount: campaign.amount,
      isOwner: campaign.userId === user.userId,
      loans: [
          {
              title: "Loan 1",
              beneficiary: "Joe Soap",
              totalAmount: 1000,
              amountPaid: 500,
          }
      ]
  };
}