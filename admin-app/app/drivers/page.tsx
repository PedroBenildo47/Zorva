"use client";
import { useEffect, useState } from "react";

interface DriverRow { id: string; name: string | null; rating: number | null; approval_status?: string }

export default function DriversPage() {
	const [drivers, setDrivers] = useState<DriverRow[]>([]);
	const [loading, setLoading] = useState(true);

	async function load() {
		setLoading(true);
		try {
			const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/users");
			const json = await res.json();
			setDrivers((json.users ?? []).filter((u: any) => u.type === "driver"));
		} catch (e) { console.error(e); } finally { setLoading(false); }
	}

	useEffect(() => { load(); }, []);

	async function approveDriverDoc(docId: string) {
		await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/drivers/documents/${docId}/approve`, { method: "PATCH" });
		await load();
	}

	return (
		<main className="p-6 mx-auto max-w-4xl">
			<h1 className="text-xl font-semibold mb-4">Entregadores</h1>
			{loading ? <p>Carregando...</p> : (
				<ul className="space-y-2">
					{drivers.map((d) => (
						<li key={d.id} className="bg-white rounded p-3 shadow">
							<div className="flex justify-between">
								<span>{d.name ?? "Sem nome"}</span>
								<span className="text-sm text-gray-600">{d.rating ? `⭐ ${d.rating.toFixed(1)}` : "—"}</span>
							</div>
							<DriverDocs driverId={d.id} onApprove={approveDriverDoc} />
						</li>
					))}
				</ul>
			)}
		</main>
	);
}

function DriverDocs({ driverId, onApprove }: { driverId: string; onApprove: (id: string) => Promise<void> }) {
	const [docs, setDocs] = useState<any[]>([]);
	useEffect(() => {
		(async () => {
			const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/drivers/documents?userId=${driverId}`);
			const json = await res.json();
			setDocs(json.documents ?? []);
		})();
	}, [driverId]);
	return (
		<div className="mt-2 space-y-2">
			{docs.length === 0 ? <p className="text-sm text-gray-500">Sem documentos enviados.</p> : docs.map((doc) => (
				<div key={doc.id} className="text-sm flex items-center justify-between">
					<a className="text-indigo-600 hover:underline" href={doc.url} target="_blank">{doc.type}</a>
					<span className="ml-2">{doc.status}</span>
					{doc.status !== "approved" && (
						<button className="ml-2 px-2 py-1 bg-green-600 text-white rounded" onClick={() => onApprove(doc.id)}>Aprovar</button>
					)}
				</div>
			))}
		</div>
	);
}