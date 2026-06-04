import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/navigation/SiteHeader'
import './Layout.css'

type LayoutProps = {
  children: ReactNode
}

/**
 * Enveloppe commune : menu fixe, contenu principal, footer.
 * Le menu adapte son fond selon le scroll de la section hero (accueil).
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <SiteHeader />

      <main className="layout__main">{children}</main>

      <footer className="layout__footer">
        <div className="layout__container">
          <p>© {new Date().getFullYear()} Maoya MakeUp — Lille</p>
        </div>
      </footer>
    </div>
  )
}
