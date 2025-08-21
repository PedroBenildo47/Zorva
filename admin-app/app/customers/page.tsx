"use client";
import { useEffect, useState } from "react";

interface UserRow { id: string; name: string | null; email?: string | null }

export default function CustomersPage() {
	const [users, setUsers] = useState<UserRow[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/users");
				const json = await res.json();
				setUsers((json.users ?? []).filter((u: any) => u.type === "client"));
			} catch (e) { console.error(e); } finally { setLoading(false); }
		})();
	}, []);
	return (
		<main className="p-6 mx-auto max-w-4xl">
			<h1 className="text-xl font-semibold mb-4">Clientes</h1>
			{loading ? <p>Carregando...</p> : (
				<table className="min-w-full bg-white rounded shadow">
					<thead>
						<tr className="text-left text-sm text-gray-600">
							<th className="p-3">Nome</th>
							<th className="p-3">Email</th>
						</tr>
					</thead>
					<tbody>
						{users.map((u) => (
							<tr key={u.id} className="border-t">
								<td className="p-3">{u.name ?? "—"}</td>
								<td className="p-3">{(u as any).email ?? "—"}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</main>
	);
}