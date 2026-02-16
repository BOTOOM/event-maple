"use client";

import { TextSearchInput } from "@/components/ui/text-search-input";

interface EventsSearchProps {
	readonly value: string;
	readonly onChange: (value: string) => void;
	readonly placeholder?: string;
}

export function EventsSearch({
	value,
	onChange,
	placeholder = "Search events...",
}: EventsSearchProps) {
	return <TextSearchInput value={value} onChange={onChange} placeholder={placeholder} />;
}
