"use client";
import { useEffect, useState } from "react";

interface OrderRow {
	id: string;
	status: string;
	amount: number;
	created_at: string;
}

export default function OrdersPage() {
	const [orders, setOrders] = useState<OrderRow[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/orders");
				const json = await res.json();
				setOrders(json.orders ?? []);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<main className="p-6 mx-auto max-w-5xl">
			<h1 className="text-xl font-semibold mb-4">Pedidos</h1>
			{loading ? (
				<p>Carregando...</p>
			) : (
				<table className="min-w-full bg-white rounded shadow">
					<thead>
						<tr className="text-left text-sm text-gray-600">
							<th className="p-3">ID</th>
							<th className="p-3">Status</th>
							<th className="p-3">Valor</th>
							<th className="p-3">Criado</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((o) => (
							<tr key={o.id} className="border-t">
								<td className="p-3 font-mono text-xs">{o.id}</td>
								<td className="p-3 capitalize">{o.status}</td>
								<td className="p-3">R$ {(o.amount / 100).toFixed(2)}</td>
								<td className="p-3">{new Date(o.created_at).toLocaleString()}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</main>
	);
}