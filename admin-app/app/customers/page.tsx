"use client";
import { useEffect, useState } from "react";

interface CustomerRow { id: string; name: string | null; email: string | null }

export default function CustomersPage() {
	const [customers, setCustomers] = useState<CustomerRow[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/users");
				const json = await res.json();
				setCustomers((json.users ?? []).filter((u: any) => u.type === "client"));
			} catch (e) { console.error(e); } finally { setLoading(false); }
		})();
	}, []);

	return (
		<main className="p-6 mx-auto max-w-4xl">
			<h1 className="text-xl font-semibold mb-4">Clientes</h1>
			{loading ? <p>Carregando...</p> : (
				<ul className="space-y-2">
					{customers.map((c) => (
						<li key={c.id} className="bg-white rounded p-3 shadow">
							<p>{c.name ?? "Sem nome"}</p>
							<p className="text-sm text-gray-600">{c.email ?? "—"}</p>
						</li>
					))}
				</ul>
			)}
		</main>
	);
}