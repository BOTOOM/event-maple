"use client";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
			router.refresh();
		});

		return () => subscription.unsubscribe();
	}, [supabase, router]);

	const signOut = async () => {
		try {
			await supabase.auth.signOut();
			// Force navigation to home page
			window.location.href = "/";
		} catch (error) {
			console.error("Error signing out:", error);
			// Still redirect on error
			window.location.href = "/";
		}
	};

	return {
		user,
		loading,
		signOut,
	};
}
