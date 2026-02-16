export interface Timezone {
	value: string;
	label: string;
	offset: string;
}

export const TIMEZONES: Timezone[] = [
	{ value: "Pacific/Midway", label: "Midway Island, Samoa", offset: "UTC-11:00" },
	{ value: "Pacific/Honolulu", label: "Hawaii", offset: "UTC-10:00" },
	{ value: "America/Anchorage", label: "Alaska", offset: "UTC-09:00" },
	{ value: "America/Los_Angeles", label: "Pacific Time (US & Canada)", offset: "UTC-08:00" },
	{ value: "America/Tijuana", label: "Tijuana, Baja California", offset: "UTC-08:00" },
	{ value: "America/Phoenix", label: "Arizona", offset: "UTC-07:00" },
	{ value: "America/Denver", label: "Mountain Time (US & Canada)", offset: "UTC-07:00" },
	{ value: "America/Chihuahua", label: "Chihuahua, La Paz, Mazatlan", offset: "UTC-07:00" },
	{ value: "America/Chicago", label: "Central Time (US & Canada)", offset: "UTC-06:00" },
	{ value: "America/Mexico_City", label: "Mexico City, Guadalajara", offset: "UTC-06:00" },
	{ value: "America/Guatemala", label: "Central America", offset: "UTC-06:00" },
	{ value: "America/Regina", label: "Saskatchewan", offset: "UTC-06:00" },
	{ value: "America/New_York", label: "Eastern Time (US & Canada)", offset: "UTC-05:00" },
	{ value: "America/Bogota", label: "Bogota, Lima, Quito", offset: "UTC-05:00" },
	{ value: "America/Indiana/Indianapolis", label: "Indiana (East)", offset: "UTC-05:00" },
	{ value: "America/Caracas", label: "Caracas", offset: "UTC-04:00" },
	{ value: "America/Halifax", label: "Atlantic Time (Canada)", offset: "UTC-04:00" },
	{ value: "America/La_Paz", label: "La Paz", offset: "UTC-04:00" },
	{ value: "America/Santiago", label: "Santiago", offset: "UTC-04:00" },
	{ value: "America/Manaus", label: "Manaus", offset: "UTC-04:00" },
	{ value: "America/St_Johns", label: "Newfoundland", offset: "UTC-03:30" },
	{ value: "America/Sao_Paulo", label: "Brasilia, São Paulo", offset: "UTC-03:00" },
	{
		value: "America/Argentina/Buenos_Aires",
		label: "Buenos Aires, Georgetown",
		offset: "UTC-03:00",
	},
	{ value: "America/Montevideo", label: "Montevideo", offset: "UTC-03:00" },
	{ value: "America/Godthab", label: "Greenland", offset: "UTC-03:00" },
	{ value: "Atlantic/South_Georgia", label: "Mid-Atlantic", offset: "UTC-02:00" },
	{ value: "Atlantic/Azores", label: "Azores", offset: "UTC-01:00" },
	{ value: "Atlantic/Cape_Verde", label: "Cape Verde Islands", offset: "UTC-01:00" },
	{ value: "UTC", label: "UTC / Coordinated Universal Time", offset: "UTC+00:00" },
	{ value: "Europe/London", label: "London, Dublin, Edinburgh", offset: "UTC+00:00" },
	{ value: "Africa/Casablanca", label: "Casablanca, Monrovia", offset: "UTC+00:00" },
	{ value: "Europe/Paris", label: "Paris, Brussels, Copenhagen", offset: "UTC+01:00" },
	{ value: "Europe/Berlin", label: "Berlin, Amsterdam, Rome", offset: "UTC+01:00" },
	{ value: "Europe/Madrid", label: "Madrid, Barcelona", offset: "UTC+01:00" },
	{ value: "Europe/Warsaw", label: "Warsaw, Sarajevo, Zagreb", offset: "UTC+01:00" },
	{ value: "Africa/Lagos", label: "West Central Africa", offset: "UTC+01:00" },
	{ value: "Europe/Athens", label: "Athens, Bucharest, Istanbul", offset: "UTC+02:00" },
	{ value: "Europe/Helsinki", label: "Helsinki, Kyiv, Riga", offset: "UTC+02:00" },
	{ value: "Africa/Cairo", label: "Cairo", offset: "UTC+02:00" },
	{ value: "Africa/Johannesburg", label: "Johannesburg, Harare", offset: "UTC+02:00" },
	{ value: "Asia/Jerusalem", label: "Jerusalem", offset: "UTC+02:00" },
	{ value: "Asia/Beirut", label: "Beirut", offset: "UTC+02:00" },
	{ value: "Europe/Moscow", label: "Moscow, St. Petersburg", offset: "UTC+03:00" },
	{ value: "Asia/Baghdad", label: "Baghdad", offset: "UTC+03:00" },
	{ value: "Asia/Kuwait", label: "Kuwait, Riyadh", offset: "UTC+03:00" },
	{ value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+03:00" },
	{ value: "Asia/Tehran", label: "Tehran", offset: "UTC+03:30" },
	{ value: "Asia/Dubai", label: "Abu Dhabi, Muscat", offset: "UTC+04:00" },
	{ value: "Asia/Baku", label: "Baku", offset: "UTC+04:00" },
	{ value: "Asia/Tbilisi", label: "Tbilisi", offset: "UTC+04:00" },
	{ value: "Asia/Yerevan", label: "Yerevan", offset: "UTC+04:00" },
	{ value: "Asia/Kabul", label: "Kabul", offset: "UTC+04:30" },
	{ value: "Asia/Karachi", label: "Islamabad, Karachi", offset: "UTC+05:00" },
	{ value: "Asia/Tashkent", label: "Tashkent", offset: "UTC+05:00" },
	{ value: "Asia/Yekaterinburg", label: "Ekaterinburg", offset: "UTC+05:00" },
	{ value: "Asia/Kolkata", label: "Chennai, Kolkata, Mumbai", offset: "UTC+05:30" },
	{ value: "Asia/Kathmandu", label: "Kathmandu", offset: "UTC+05:45" },
	{ value: "Asia/Dhaka", label: "Dhaka, Astana", offset: "UTC+06:00" },
	{ value: "Asia/Almaty", label: "Almaty, Novosibirsk", offset: "UTC+06:00" },
	{ value: "Asia/Rangoon", label: "Yangon (Rangoon)", offset: "UTC+06:30" },
	{ value: "Asia/Bangkok", label: "Bangkok, Hanoi, Jakarta", offset: "UTC+07:00" },
	{ value: "Asia/Krasnoyarsk", label: "Krasnoyarsk", offset: "UTC+07:00" },
	{ value: "Asia/Shanghai", label: "Beijing, Shanghai, Hong Kong", offset: "UTC+08:00" },
	{ value: "Asia/Singapore", label: "Singapore, Kuala Lumpur", offset: "UTC+08:00" },
	{ value: "Asia/Taipei", label: "Taipei", offset: "UTC+08:00" },
	{ value: "Australia/Perth", label: "Perth", offset: "UTC+08:00" },
	{ value: "Asia/Irkutsk", label: "Irkutsk, Ulaanbaatar", offset: "UTC+08:00" },
	{ value: "Asia/Tokyo", label: "Tokyo, Osaka, Sapporo", offset: "UTC+09:00" },
	{ value: "Asia/Seoul", label: "Seoul", offset: "UTC+09:00" },
	{ value: "Asia/Yakutsk", label: "Yakutsk", offset: "UTC+09:00" },
	{ value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+09:30" },
	{ value: "Australia/Darwin", label: "Darwin", offset: "UTC+09:30" },
	{ value: "Australia/Sydney", label: "Sydney, Melbourne, Canberra", offset: "UTC+10:00" },
	{ value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10:00" },
	{ value: "Australia/Hobart", label: "Hobart", offset: "UTC+10:00" },
	{ value: "Pacific/Guam", label: "Guam, Port Moresby", offset: "UTC+10:00" },
	{ value: "Asia/Vladivostok", label: "Vladivostok", offset: "UTC+10:00" },
	{ value: "Pacific/Noumea", label: "New Caledonia, Solomon Islands", offset: "UTC+11:00" },
	{ value: "Asia/Magadan", label: "Magadan", offset: "UTC+11:00" },
	{ value: "Pacific/Fiji", label: "Fiji, Marshall Islands", offset: "UTC+12:00" },
	{ value: "Pacific/Auckland", label: "Auckland, Wellington", offset: "UTC+12:00" },
	{ value: "Asia/Kamchatka", label: "Kamchatka", offset: "UTC+12:00" },
	{ value: "Pacific/Tongatapu", label: "Nuku'alofa", offset: "UTC+13:00" },
	{ value: "Pacific/Apia", label: "Samoa", offset: "UTC+13:00" },
	{ value: "Pacific/Kiritimati", label: "Kiritimati", offset: "UTC+14:00" },
];

export function getTimezoneByValue(value: string): Timezone | undefined {
	return TIMEZONES.find((tz) => tz.value === value);
}

export function searchTimezones(query: string): Timezone[] {
	if (!query.trim()) return TIMEZONES;
	const lowerQuery = query.toLowerCase();
	return TIMEZONES.filter(
		(tz) =>
			tz.label.toLowerCase().includes(lowerQuery) ||
			tz.value.toLowerCase().includes(lowerQuery) ||
			tz.offset.toLowerCase().includes(lowerQuery),
	);
}

export function formatTimezoneLabel(tz: Timezone): string {
	return `(${tz.offset}) ${tz.label}`;
}
