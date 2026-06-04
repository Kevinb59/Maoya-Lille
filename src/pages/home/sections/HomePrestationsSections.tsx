import { homePrestationSections } from '@/config/homePrestations'
import { HomePrestationSection } from './HomePrestationSection'

/**
 * Les trois blocs prestations (Chouchouter, Coacher, Divertir).
 */
export function HomePrestationsSections() {
  return (
    <>
      {homePrestationSections.map((section) => (
        <HomePrestationSection key={section.id} config={section} />
      ))}
    </>
  )
}
