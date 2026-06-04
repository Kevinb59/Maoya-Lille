import {
  HOME_INFOS_SECTION_ID,
  homeInfosContent,
} from '@/config/homeInfos'
import { NewsletterSignup } from './NewsletterSignup'
import './HomeInfosSection.css'

const NEWSLETTER_FORM_ID = 'home-infos-newsletter'

/**
 * Section Infos — visite salon, horaires, déplacement, avis & newsletter.
 */
export function HomeInfosSection() {
  const { sectionTitle, visit, homeService, closureNotice } = homeInfosContent

  return (
    <section
      id={HOME_INFOS_SECTION_ID}
      className="home-infos"
      aria-labelledby="home-infos-title"
    >
      <div className="home-infos__container">
        <header className="home-infos__header">
          <h2 id="home-infos-title" className="home-infos__title">
            {sectionTitle}
          </h2>
        </header>

        <div className="home-infos__grid">
          <article className="home-infos__visit" aria-labelledby="home-infos-visit-title">
            <h3 id="home-infos-visit-title" className="home-infos__block-title">
              {visit.title}
            </h3>
            <p className="home-infos__intro">{visit.intro}</p>

            <ul className="home-infos__schedule">
              {visit.schedule.map((item) => (
                <li key={item.label} className="home-infos__schedule-item">
                  <span className="home-infos__schedule-label">{item.label}</span>
                  {' : '}
                  <span className="home-infos__schedule-detail">{item.detail}</span>
                </li>
              ))}
            </ul>

            <p className="home-infos__home-service">{homeService}</p>

            {closureNotice ? (
              <aside className="home-infos__notice" role="note">
                {closureNotice}
              </aside>
            ) : null}
          </article>

          <NewsletterSignup formId={NEWSLETTER_FORM_ID} />
        </div>
      </div>
    </section>
  )
}
