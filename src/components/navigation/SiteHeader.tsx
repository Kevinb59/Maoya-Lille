import { useCallback, useEffect, useState, type CSSProperties } from 'react'

import { useActiveNavSection } from '@/hooks/useActiveNavSection'

import { useSectionScrollProgress } from '@/hooks/useSectionScrollProgress'

import { HOME_HERO_SECTION_ID } from '@/lib/assets'

import { contactPhoneDisplay, contactPhoneHref } from '@/config/contact'

import { mainNavItems, mainNavSectionIds } from '@/config/navigation'

import { SiteHeaderSocial } from '@/components/navigation/SiteHeaderSocial'

import './SiteHeader.css'



const NAV_DESKTOP_MIN_PX = 1050



type SiteHeaderProps = {

  /** Id de la section dont le scroll pilote l'apparition du fond (page d'accueil) */

  scrollSectionId?: string

}



/**

 * Menu fixe en haut : transparent en haut de page, fond opaque en fin de la 1ʳᵉ section.

 * En dessous de 1050px : navigation en panneau latéral (hamburger).

 */

export function SiteHeader({

  scrollSectionId = HOME_HERO_SECTION_ID,

}: SiteHeaderProps) {

  const scrollProgress = useSectionScrollProgress(scrollSectionId)

  const activeSectionId = useActiveNavSection(mainNavSectionIds)

  const [isNavOpen, setIsNavOpen] = useState(false)



  const closeNav = useCallback(() => setIsNavOpen(false), [])

  const toggleNav = useCallback(() => setIsNavOpen((open) => !open), [])



  /* Fermeture au passage desktop, Escape, et blocage du scroll corps */

  useEffect(() => {

    const desktopMq = window.matchMedia(`(min-width: ${NAV_DESKTOP_MIN_PX}px)`)



    const onViewportChange = () => {

      if (desktopMq.matches) closeNav()

    }



    desktopMq.addEventListener('change', onViewportChange)

    return () => desktopMq.removeEventListener('change', onViewportChange)

  }, [closeNav])



  useEffect(() => {

    if (!isNavOpen) return



    const onKeyDown = (event: KeyboardEvent) => {

      if (event.key === 'Escape') closeNav()

    }



    document.body.style.overflow = 'hidden'

    document.addEventListener('keydown', onKeyDown)



    return () => {

      document.body.style.overflow = ''

      document.removeEventListener('keydown', onKeyDown)

    }

  }, [isNavOpen, closeNav])



  return (

    <header

      className={`site-header${isNavOpen ? ' site-header--nav-open' : ''}`}

      style={

        {

          '--header-scroll-progress': scrollProgress,

        } as CSSProperties

      }

    >

      <div className="site-header__inner">

        <div className="site-header__lead">

          <a

            href={contactPhoneHref}

            className="site-header__brand"

            aria-label={`Appeler le ${contactPhoneDisplay}`}

          >

            {contactPhoneDisplay}

          </a>

          <SiteHeaderSocial />

        </div>



        {/* Bouton hamburger — visible uniquement sous 1050px */}

        <button

          type="button"

          className="site-header__menu-toggle"

          aria-expanded={isNavOpen}

          aria-controls="site-header-nav"

          onClick={toggleNav}

        >

          <span className="site-header__menu-toggle-label">

            {isNavOpen ? 'Fermer le menu' : 'Ouvrir le menu'}

          </span>

          <span className="site-header__menu-bars" aria-hidden="true">

            <span className="site-header__menu-bar" />

            <span className="site-header__menu-bar" />

            <span className="site-header__menu-bar" />

          </span>

        </button>



        {/* Fond cliquable pour fermer le panneau mobile */}

        <button

          type="button"

          className="site-header__backdrop"

          aria-label="Fermer le menu"

          tabIndex={isNavOpen ? 0 : -1}

          onClick={closeNav}

        />



        <nav

          id="site-header-nav"

          className={`site-header__nav${isNavOpen ? ' site-header__nav--open' : ''}`}

          aria-label="Navigation principale"

        >

          <ul className="site-header__list">

            {mainNavItems.map((item) => {

              const isActive = activeSectionId === item.sectionId



              return (

                <li key={item.href}>

                  <a

                    href={item.href}

                    className={`site-header__link${isActive ? ' site-header__link--active' : ''}`}

                    style={

                      {

                        '--nav-accent': item.accentColor,

                      } as CSSProperties

                    }

                    aria-current={isActive ? 'location' : undefined}

                    onClick={closeNav}

                  >

                    {item.label}

                  </a>

                </li>

              )

            })}

          </ul>

        </nav>

      </div>

    </header>

  )

}

