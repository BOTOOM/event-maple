"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface PasswordInputProps {
	readonly id: string;
	readonly name?: string;
	readonly placeholder?: string;
	readonly required?: boolean;
	readonly disabled?: boolean;
	readonly value: string;
	readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	readonly className?: string;
}

export function PasswordInput({
	id,
	name,
	placeholder,
	required = false,
	disabled = false,
	value,
	onChange,
	className = "",
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="relative">
			<Input
				id={id}
				name={name}
				type={showPassword ? "text" : "password"}
				placeholder={placeholder}
				required={required}
				disabled={disabled}
				className={`pr-10 ${className}`}
				value={value}
				onChange={onChange}
			/>
			<button
				type="button"
				onClick={() => setShowPassword(!showPassword)}
				className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
				tabIndex={-1}
				aria-label={showPassword ? "Hide password" : "Show password"}
			>
				{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
			</button>
		</div>
	);
}
