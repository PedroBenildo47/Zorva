import Link from "next/link";

export default function Page() {
	return (
		<main className="p-6 mx-auto max-w-6xl">
			<header className="mb-6">
				<h1 className="text-2xl font-semibold">Zorva Admin</h1>
				<p className="text-gray-600">Visão geral do sistema</p>
			</header>
			<section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="bg-white rounded-lg shadow p-4">
					<h2 className="text-sm text-gray-500">Pedidos hoje</h2>
					<p className="text-3xl font-bold">—</p>
				</div>
				<div className="bg-white rounded-lg shadow p-4">
					<h2 className="text-sm text-gray-500">Entregadores ativos</h2>
					<p className="text-3xl font-bold">—</p>
				</div>
				<div className="bg-white rounded-lg shadow p-4">
					<h2 className="text-sm text-gray-500">Receita (R$)</h2>
					<p className="text-3xl font-bold">—</p>
				</div>
			</section>
			<nav className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Link className="bg-white rounded-lg shadow p-4 hover:ring-2 ring-indigo-500" href="/orders">Pedidos</Link>
				<Link className="bg-white rounded-lg shadow p-4 hover:ring-2 ring-indigo-500" href="/drivers">Entregadores</Link>
				<Link className="bg-white rounded-lg shadow p-4 hover:ring-2 ring-indigo-500" href="/customers">Clientes</Link>
			</nav>
		</main>
	);
}