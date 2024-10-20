import { error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { check_session } from "$lib/server/sessions";
import { getUserById } from "$lib/server/database/users";
import { pay } from "$lib/server/payments/single";

export const load: PageServerLoad = async ({ params }) => {
  return {
    loans: [
      {
        title: "Loan 1",
        beneficiary: "Joe Soap",
        totalAmount: 1000,
        amountPaid: 500,
      },
    ],
  };
};

export const actions: Actions = {
  pay: async ({ request, cookies }) => {
    const userUuid = check_session(cookies.get("session"));
    if (!userUuid) return error(401);

    const user = await getUserById(userUuid);
    if (!user) return error(401);

    const data = await request.formData();
    const dstId = data.get("id");
    const amountStr = data.get("amount");
    const redir = data.get("redirect");

    if (!dstId || typeof dstId !== "string") {
      return fail(422);
    }
    if (!amountStr || typeof amountStr !== "string") {
      return fail(422);
    }
    if (!redir || typeof redir !== "string") {
      return fail(422);
    }
    const amount = Number(amountStr);
    if (Number.isNaN(amount)) {
      return fail(422);
    }

    const dstUser = await getUserById(dstId);
    if (dstUser === null) return fail(400);

    await pay(
      user.walletAddress,
      dstUser.walletAddress,
      {
        value: String(Math.round(amount * 100)),
        assetCode: "ZAR",
        assetScale: 2,
      },
      redir,
    );
  },
};
