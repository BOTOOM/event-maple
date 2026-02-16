"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface TextSearchInputProps {
	readonly value: string;
	readonly onChange: (value: string) => void;
	readonly placeholder: string;
	readonly clearAriaLabel?: string;
}

export function TextSearchInput({
	value,
	onChange,
	placeholder,
	clearAriaLabel = "Clear search",
}: TextSearchInputProps) {
	const [localValue, setLocalValue] = useState(value);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleClear = () => {
		setLocalValue("");
		onChange("");
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setLocalValue(newValue);
		onChange(newValue);
	};

	return (
		<div className="relative w-full">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
				<input
					type="text"
					value={localValue}
					onChange={handleChange}
					placeholder={placeholder}
					className="
            w-full pl-10 pr-10 py-3 
            border border-border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            bg-card text-foreground placeholder-muted-foreground
            transition-all
          "
				/>
				{localValue && (
					<button
						type="button"
						onClick={handleClear}
						className="
              absolute right-3 top-1/2 -translate-y-1/2
              p-1 rounded-full hover:bg-secondary transition-colors
            "
						aria-label={clearAriaLabel}
					>
						<X className="h-4 w-4 text-muted-foreground" />
					</button>
				)}
			</div>
		</div>
	);
}
