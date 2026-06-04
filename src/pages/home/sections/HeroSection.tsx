import { useCallback, useEffect, useRef, useState } from 'react'
import { homeAssets, HOME_HERO_SECTION_ID } from '@/lib/assets'
import './HeroSection.css'

/**
 * Première section : vidéo en arrière-plan fixe (ne défile pas),
 * contenu et logo défilent par-dessus.
 * Lecture : hero-pingpong.mp4 (avant + arrière dans un seul fichier, loop native).
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const logoSceneRef = useRef<HTMLDivElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [isHeroInView, setIsHeroInView] = useState(true)

  /**
   * Coupe la vidéo fixe hors écran : évite qu'elle déborde sur les sections suivantes.
   */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroInView(entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || videoFailed) return

    if (isHeroInView && videoReady) {
      video.play().catch(() => {
        /* Lecture auto bloquée */
      })
      return
    }

    video.pause()
  }, [isHeroInView, videoReady, videoFailed])

  const handleVideoCanPlay = useCallback(() => {
    setVideoReady(true)
    videoRef.current?.play().catch(() => {
      /* Lecture auto bloquée par le navigateur — fond dégradé reste visible */
    })
  }, [])

  const handleVideoError = useCallback(() => {
    setVideoFailed(true)
  }, [])

  /**
   * Inclinaison 3D du logo selon la position du curseur.
   */
  const handleLogoPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const scene = logoSceneRef.current
      if (!scene) return

      const rect = scene.getBoundingClientRect()
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5

      scene.style.setProperty('--logo-tilt-y', `${offsetX * 10}deg`)
      scene.style.setProperty('--logo-tilt-x', `${-offsetY * 8}deg`)
      scene.style.setProperty('--logo-lift', '28px')
    },
    [],
  )

  const handleLogoPointerLeave = useCallback(() => {
    const scene = logoSceneRef.current
    if (!scene) return

    scene.style.setProperty('--logo-tilt-x', '6deg')
    scene.style.setProperty('--logo-tilt-y', '-4deg')
    scene.style.setProperty('--logo-lift', '18px')
  }, [])

  const showVideo = !videoFailed

  return (
    <section
      ref={sectionRef}
      id={HOME_HERO_SECTION_ID}
      className="hero"
      aria-label="Accueil Maoya MakeUp"
    >
      {/* Calque vidéo fixe — visible uniquement tant que le hero est à l'écran */}
      <div
        className={`hero__media${videoReady ? ' hero__media--ready' : ''}${videoFailed ? ' hero__media--fallback' : ''}${!isHeroInView ? ' hero__media--offscreen' : ''}`}
        aria-hidden="true"
      >
        {showVideo && (
          <video
            ref={videoRef}
            className="hero__video"
            muted
            playsInline
            loop
            autoPlay
            preload="metadata"
            onCanPlay={handleVideoCanPlay}
            onError={handleVideoError}
          >
            {/* Généré par npm run video:pingpong depuis hero2.mp4 */}
            <source
              src={homeAssets.hero.videoPingPong}
              type="video/mp4"
            />
          </video>
        )}
      </div>

      {/* Dégradé lié à la section (défile avec la page, pas avec la vidéo fixe) */}
      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__content">
        <div className="hero__brand">
          <div
            ref={logoSceneRef}
            className="hero__logo-scene"
            onPointerMove={handleLogoPointerMove}
            onPointerLeave={handleLogoPointerLeave}
          >
            <div className="hero__logo-stack">
            <img
              src={homeAssets.hero.logo}
              alt=""
              className="hero__logo hero__logo--depth"
              width={960}
              height={240}
              decoding="async"
              aria-hidden="true"
              draggable={false}
            />
            <img
              src={homeAssets.hero.logo}
              alt=""
              className="hero__logo hero__logo--edge hero__logo--edge-1"
              width={960}
              height={240}
              decoding="async"
              aria-hidden="true"
              draggable={false}
            />
            <img
              src={homeAssets.hero.logo}
              alt=""
              className="hero__logo hero__logo--edge hero__logo--edge-2"
              width={960}
              height={240}
              decoding="async"
              aria-hidden="true"
              draggable={false}
            />
            <img
              src={homeAssets.hero.logo}
              alt=""
              className="hero__logo hero__logo--edge hero__logo--edge-3"
              width={960}
              height={240}
              decoding="async"
              aria-hidden="true"
              draggable={false}
            />
            <img
              src={homeAssets.hero.logo}
              alt="Maoya MakeUp"
              className="hero__logo hero__logo--face"
              width={960}
              height={240}
              decoding="async"
              fetchPriority="high"
              draggable={false}
            />
            </div>
          </div>

          <p className="hero__tagline">
            <span className="hero__tagline-line hero__tagline-line--primary">
              Maquillage
            </span>
            <span className="hero__tagline-line hero__tagline-line--secondary">
              &amp; conseil en image
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
