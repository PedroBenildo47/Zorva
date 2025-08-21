"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function Page() {
	const [stats, setStats] = useState<any>({ orders: 0, drivers: 0, revenue: 0 });
	const [series, setSeries] = useState<Array<{ d: string; v: number }>>([]);
	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/orders");
				const json = await res.json();
				setStats({ orders: json.orders?.length ?? 0, drivers: 12, revenue: (json.orders ?? []).reduce((s: number, o: any) => s + (o.amount||0), 0)/100 });
				setSeries((json.orders ?? []).slice(0, 12).reverse().map((o: any, i: number) => ({ d: String(i+1), v: o.amount/100 })));
			} catch {}
		})();
	}, []);
	return (
		<div className="mx-auto max-w-7xl">
			<header className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<img src="/logo.svg" alt="Zorva" className="h-10" />
					<h1 className="text-2xl font-semibold">Zorva Admin</h1>
				</div>
				<Link href="/orders" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Ver pedidos</Link>
			</header>
			<section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="card border-l-4 border-blue-500">
					<h2 className="text-sm text-slate-500">Pedidos</h2>
					<p className="text-3xl font-bold">{stats.orders}</p>
				</div>
				<div className="card border-l-4 border-orange-500">
					<h2 className="text-sm text-slate-500">Entregadores ativos</h2>
					<p className="text-3xl font-bold">{stats.drivers}</p>
				</div>
				<div className="card border-l-4 border-emerald-500">
					<h2 className="text-sm text-slate-500">Receita (R$)</h2>
					<p className="text-3xl font-bold">{stats.revenue.toFixed(2)}</p>
				</div>
			</section>
			<section className="card">
				<h3 className="mb-3 font-semibold">Vendas recentes</h3>
				<div className="h-60">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={series}>
							<XAxis dataKey="d" />
							<YAxis />
							<Tooltip />
							<Line type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</section>
		</div>
	);
}