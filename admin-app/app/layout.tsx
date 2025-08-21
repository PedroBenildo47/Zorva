import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Zorva Admin",
	description: "Painel de administração Zorva",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR">
			<body className="min-h-screen bg-slate-50 text-slate-900">
				<div className="min-h-screen flex">
					<aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white p-4 gap-4">
						<div className="flex items-center gap-2">
							<img src="/logo.svg" alt="Zorva" className="h-10" />
						</div>
						<nav className="flex-1 space-y-2 text-sm">
							<Link className="nav-link" href="/">Dashboard</Link>
							<Link className="nav-link" href="/orders">Pedidos</Link>
							<Link className="nav-link" href="/drivers">Entregadores</Link>
							<Link className="nav-link" href="/customers">Clientes</Link>
						</nav>
						<p className="text-xs text-slate-400">© Zorva</p>
					</aside>
					<main className="flex-1 p-4 md:p-6">{children}</main>
				</div>
			</body>
		</html>
	);
}