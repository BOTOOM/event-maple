"use client";

import { TextSearchInput } from "@/components/ui/text-search-input";

interface TalksSearchProps {
	readonly value: string;
	readonly onChange: (value: string) => void;
	readonly placeholder?: string;
}

export function TalksSearch({
	value,
	onChange,
	placeholder = "Search talks...",
}: TalksSearchProps) {
	return <TextSearchInput value={value} onChange={onChange} placeholder={placeholder} />;
}
