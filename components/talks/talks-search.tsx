"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

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
	const [localValue, setLocalValue] = useState(value);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleClear = () => {
		setLocalValue("");
		onChange("");
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setLocalValue(newValue);
		onChange(newValue);
	};

	return (
		<div className="relative w-full">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
				<input
					type="text"
					value={localValue}
					onChange={handleChange}
					placeholder={placeholder}
					className="
            w-full pl-10 pr-10 py-3 
            border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            bg-white text-gray-900 placeholder-gray-400
            transition-all
          "
				/>
				{localValue && (
					<button
						type="button"
						onClick={handleClear}
						className="
              absolute right-3 top-1/2 -translate-y-1/2
              p-1 rounded-full hover:bg-gray-100 transition-colors
            "
						aria-label="Clear search"
					>
						<X className="h-4 w-4 text-gray-500" />
					</button>
				)}
			</div>
		</div>
	);
}
