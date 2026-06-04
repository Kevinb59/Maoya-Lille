import { lazy, Suspense } from 'react'
import { HeroSection } from '@/pages/home/sections/HeroSection'
import { HomeIntroSection } from '@/pages/home/sections/HomeIntroSection'
import { LazyWhenVisible } from '@/components/LazyWhenVisible'
import { SectionPlaceholder } from '@/components/SectionPlaceholder/SectionPlaceholder'

/* Sections below-the-fold — chunks séparés, montés à l’approche du viewport */
const HomePrestationsSections = lazy(() =>
  import('@/pages/home/sections/HomePrestationsSections').then((module) => ({
    default: module.HomePrestationsSections,
  })),
)
const GoogleReviews = lazy(() =>
  import('@/components/GoogleReviews').then((module) => ({
    default: module.GoogleReviews,
  })),
)
const TrustedPartnersSection = lazy(() =>
  import('@/components/TrustedPartners').then((module) => ({
    default: module.TrustedPartnersSection,
  })),
)
const HomeUniversCarouselSection = lazy(() =>
  import('@/pages/home/sections/HomeUniversCarouselSection').then((module) => ({
    default: module.HomeUniversCarouselSection,
  })),
)
const HomeInfosSection = lazy(() =>
  import('@/pages/home/sections/HomeInfosSection').then((module) => ({
    default: module.HomeInfosSection,
  })),
)

/**
 * Page d'accueil — hero + intro en priorité ; reste chargé au scroll.
 */
export function HomePage() {
  return (
    <>
      <HeroSection />
      <HomeIntroSection />

      <LazyWhenVisible
        minHeight="60vh"
        fallback={<SectionPlaceholder minHeight="60vh" />}
      >
        <Suspense fallback={<SectionPlaceholder minHeight="60vh" />}>
          <HomePrestationsSections />
        </Suspense>
      </LazyWhenVisible>

      <LazyWhenVisible
        minHeight="50vh"
        fallback={<SectionPlaceholder minHeight="50vh" />}
      >
        <Suspense fallback={<SectionPlaceholder minHeight="50vh" />}>
          <GoogleReviews />
        </Suspense>
      </LazyWhenVisible>

      <LazyWhenVisible
        minHeight="40vh"
        fallback={<SectionPlaceholder minHeight="40vh" />}
      >
        <Suspense fallback={<SectionPlaceholder minHeight="40vh" />}>
          <TrustedPartnersSection />
        </Suspense>
      </LazyWhenVisible>

      <LazyWhenVisible
        minHeight="55vh"
        fallback={<SectionPlaceholder minHeight="55vh" />}
      >
        <Suspense fallback={<SectionPlaceholder minHeight="55vh" />}>
          <HomeUniversCarouselSection />
        </Suspense>
      </LazyWhenVisible>

      <LazyWhenVisible
        minHeight="45vh"
        fallback={<SectionPlaceholder minHeight="45vh" />}
      >
        <Suspense fallback={<SectionPlaceholder minHeight="45vh" />}>
          <HomeInfosSection />
        </Suspense>
      </LazyWhenVisible>
    </>
  )
}
