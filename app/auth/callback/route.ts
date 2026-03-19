import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const origin = requestUrl.origin;
	const next = requestUrl.searchParams.get("next");

	const isValidNext = !!next && next.startsWith("/") && !next.startsWith("//");

	if (code) {
		const supabase = await createClient();
		await supabase.auth.exchangeCodeForSession(code);
	}

	// Redirect to events page after successful auth
	return NextResponse.redirect(new URL(isValidNext ? next : "/events", origin));
}
