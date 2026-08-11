import { ChevronRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Início', href: '#inicio' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Avaliações', href: '#avaliacoes' },
  { label: 'Sobre', href: '#sobre' }
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-7 lg:px-10" aria-label="Menu principal">
        <a href="#inicio" className="flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue">
          <span className="brand-mark">S</span>
          <span>
            <span className="block text-xl font-black leading-5">SAMPAIO</span>
            <span className="block text-[0.65rem] font-semibold uppercase text-white/70">Motorista particular</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item, index) => (
            <a key={item.href} className={`nav-link ${index === 0 ? 'nav-link-active' : ''}`} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a className="btn btn-primary" href="#solicitar">
            Solicitar orçamento
            <ChevronRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brandBlue lg:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </nav>

      {open ? (
        <div className="mx-4 rounded-lg border border-white/10 bg-[#07101a]/95 px-4 py-4 shadow-2xl backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <a key={item.href} className="mobile-nav-link" href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <a className="btn btn-primary mt-2 justify-center" href="#solicitar" onClick={() => setOpen(false)}>
              Solicitar orçamento
              <ChevronRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
