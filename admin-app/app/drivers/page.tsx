"use client";
import { useEffect, useState } from "react";

interface DriverRow { id: string; name: string | null; rating: number | null }

export default function DriversPage() {
	const [drivers, setDrivers] = useState<DriverRow[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/users");
				const json = await res.json();
				setDrivers((json.users ?? []).filter((u: any) => u.type === "driver"));
			} catch (e) { console.error(e); } finally { setLoading(false); }
		})();
	}, []);

	return (
		<main className="p-6 mx-auto max-w-4xl">
			<h1 className="text-xl font-semibold mb-4">Entregadores</h1>
			{loading ? <p>Carregando...</p> : (
				<ul className="space-y-2">
					{drivers.map((d) => (
						<li key={d.id} className="bg-white rounded p-3 shadow flex justify-between">
							<span>{d.name ?? "Sem nome"}</span>
							<span className="text-sm text-gray-600">{d.rating ? `⭐ ${d.rating.toFixed(1)}` : "—"}</span>
						</li>
					))}
				</ul>
			)}
		</main>
	);
}