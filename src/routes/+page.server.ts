import { getCampaignByUser } from "$lib/server/database/campaign";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { check_session } from "$lib/server/sessions";
import { getUserById } from "$lib/server/database/users";
import { getCommmunityByUser } from "$lib/server/database/community";
import "$lib/server/ledger/index";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const userUuid = check_session(cookies.get("session"));
  if (!userUuid) return redirect(303, "/login");

  const user = await getUserById(userUuid);
  if (!user) return redirect(303, "/login");

  const communities = await getCommmunityByUser(userUuid);
  const campaigns = await getCampaignByUser(userUuid);

  return {
    user,
    communities,
    campaigns: campaigns.map((campaign, index) => ({
      imageURL:
        "https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg", // Placeholder image, change if necessary
      title: campaign.name || `Campaign ${index + 1}`, // Or use campaign.name if available
      description: campaign.description || `This is campaign ${index + 1}`, // Fallback description
      actionText: `View Campaign ${index + 1}`,
      url: `campaign/${campaign.campaignId}`,
    })),
  };
};
