export function hasSupabaseErrorCode(error: unknown, code: string): boolean {
	if (!error || typeof error !== "object") {
		return false;
	}

	const errorCode = "code" in error ? (error.code as string | undefined) : undefined;
	return errorCode === code;
}

export function isMissingTableError(error: unknown): boolean {
	return hasSupabaseErrorCode(error, "42P01");
}

export function isMissingColumnError(error: unknown): boolean {
	return hasSupabaseErrorCode(error, "42703");
}
