import { handleForm } from "@/lib/server/form-handler";

export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) {
  return handleForm(request, "contact");
}
