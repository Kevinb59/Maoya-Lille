import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import './ParticleLogoEffect.css'

export type ParticleShape = 'grain' | 'circle'
export type PointerMode = 'attract' | 'repel'

export type ParticleLogoEffectProps = {
  text?: string
  imageSrc?: string
  useImage?: boolean
  /** Multiplicateur de taille du logo/image dans le masque (plus de particules, pas plus grosses) */
  imageScale?: number
  particleGap?: number
  particleSize?: number
  mouseRadius?: number
  force?: number
  /** attract = particules tirées vers le curseur ; repel = repoussées */
  pointerMode?: PointerMode
  returnSpeed?: number
  backgroundColor?: string
  particleColor?: string
  /** grain = pixels carrés type newmixcoffee.com */
  particleShape?: ParticleShape
  className?: string
  style?: CSSProperties
}

type Particle = {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  alpha: number
}

type PointerState = {
  x: number
  y: number
  active: boolean
}

const DEFAULT_TEXT = 'start\nwith\nmix.'
const FONT_FAMILY =
  '"Arial Black", "Helvetica Neue", "Segoe UI", system-ui, sans-serif'
const FRICTION = 0.88
/** Seuil alpha — uniquement les pixels visibles du logo / texte */
const ALPHA_THRESHOLD = 48
const MAX_PARTICLES = 48000

/** Réglages proches du hero newmixcoffee.com */
export const NEWMIX_PARTICLE_PRESET = {
  particleGap: 2,
  particleSize: 1,
  mouseRadius: 140,
  force: 9,
  returnSpeed: 0.06,
  particleShape: 'grain' as ParticleShape,
  backgroundColor: '#000000',
  particleColor: '#ffffff',
}

const defaultProps = {
  text: DEFAULT_TEXT,
  useImage: false,
  particleGap: NEWMIX_PARTICLE_PRESET.particleGap,
  particleSize: NEWMIX_PARTICLE_PRESET.particleSize,
  mouseRadius: NEWMIX_PARTICLE_PRESET.mouseRadius,
  force: NEWMIX_PARTICLE_PRESET.force,
  returnSpeed: NEWMIX_PARTICLE_PRESET.returnSpeed,
  particleShape: NEWMIX_PARTICLE_PRESET.particleShape,
  backgroundColor: NEWMIX_PARTICLE_PRESET.backgroundColor,
  particleColor: NEWMIX_PARTICLE_PRESET.particleColor,
} as const

/**
 * Parse une couleur hex/rgb en composantes RGB pour le canvas.
 */
function parseParticleRgb(color: string): [number, number, number] {
  const trimmed = color.trim()

  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1)
    const full =
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex.padEnd(6, '0').slice(0, 6)

    return [
      Number.parseInt(full.slice(0, 2), 16),
      Number.parseInt(full.slice(2, 4), 16),
      Number.parseInt(full.slice(4, 6), 16),
    ]
  }

  return [255, 255, 255]
}

/**
 * Calcule une taille de police responsive pour remplir la zone utile.
 */
function resolveFontSize(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  maxWidth: number,
  maxHeight: number,
): number {
  let fontSize = Math.min(maxWidth * 0.22, maxHeight / (lines.length * 1.05))

  while (fontSize > 10) {
    ctx.font = `900 ${fontSize}px ${FONT_FAMILY}`
    const lineHeight = fontSize * 0.92
    const totalHeight = lines.length * lineHeight
    const widest = Math.max(
      ...lines.map((line) => ctx.measureText(line).width),
      0,
    )

    if (widest <= maxWidth * 0.92 && totalHeight <= maxHeight * 0.88) {
      return fontSize
    }

    fontSize -= 2
  }

  return 12
}

/**
 * Échantillonne les pixels opaques d’un canvas source → positions de particules.
 */
function sampleParticlesFromCanvas(
  source: CanvasRenderingContext2D,
  width: number,
  height: number,
  gap: number,
  baseSize: number,
  grainMode: boolean,
): Particle[] {
  const { data } = source.getImageData(0, 0, width, height)
  const particles: Particle[] = []
  const step = Math.max(1, Math.round(gap))

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const index = (y * width + x) * 4
      const alpha = data[index + 3]

      /* Ne garder que les pixels réellement visibles (évite le rectangle plein) */
      if (alpha < ALPHA_THRESHOLD) {
        continue
      }

      const jitter = grainMode ? 0.85 : 0.55
      const size = grainMode
        ? baseSize * (0.82 + Math.random() * 0.38)
        : baseSize * (0.72 + Math.random() * 0.56)
      const particleAlpha = grainMode
        ? 0.55 + Math.random() * 0.45
        : 0.35 + Math.random() * 0.65

      const baseX = x + (Math.random() - 0.5) * jitter
      const baseY = y + (Math.random() - 0.5) * jitter

      particles.push({
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        vx: 0,
        vy: 0,
        size,
        alpha: particleAlpha * (alpha / 255),
      })

      if (particles.length >= MAX_PARTICLES) {
        return particles
      }
    }
  }

  return particles
}

/**
 * Dessine le texte multi-lignes centré sur un canvas offscreen.
 */
function drawTextMask(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string,
) {
  const lines = text.split('\n')
  const paddingX = width * 0.08
  const paddingY = height * 0.1
  const boxWidth = width - paddingX * 2
  const boxHeight = height - paddingY * 2

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const fontSize = resolveFontSize(ctx, lines, boxWidth, boxHeight)
  ctx.font = `900 ${fontSize}px ${FONT_FAMILY}`
  ctx.letterSpacing = '-0.04em'

  const lineHeight = fontSize * 0.9
  const totalHeight = lines.length * lineHeight
  const startY = height / 2 - totalHeight / 2 + lineHeight / 2

  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight)
  })
}

/**
 * Effet particules type newmixcoffee — texte ou logo en points interactifs (Canvas 2D).
 */
export function ParticleLogoEffect({
  text = defaultProps.text,
  imageSrc,
  useImage = defaultProps.useImage,
  imageScale = 1,
  particleGap = defaultProps.particleGap,
  particleSize = defaultProps.particleSize,
  mouseRadius = defaultProps.mouseRadius,
  force = defaultProps.force,
  pointerMode = 'attract',
  returnSpeed = defaultProps.returnSpeed,
  backgroundColor = defaultProps.backgroundColor,
  particleColor = defaultProps.particleColor,
  particleShape = defaultProps.particleShape,
  className = '',
  style,
}: ParticleLogoEffectProps) {
  const grainMode = particleShape === 'grain'
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const pointerRef = useRef<PointerState>({ x: -9999, y: -9999, active: false })
  const animationRef = useRef<number>(0)
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })
  const reducedMotionRef = useRef(false)

  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const particleRgb = useMemo(
    () => parseParticleRgb(particleColor),
    [particleColor],
  )

  /**
   * Construit le masque (texte ou image) puis initialise le tableau de particules.
   */
  const buildParticles = useCallback(async () => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const rect = container.getBoundingClientRect()
    const width = Math.max(1, Math.floor(rect.width))
    const height = Math.max(1, Math.floor(rect.height))
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    sizeRef.current = { width, height, dpr }

    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = width
    maskCanvas.height = height
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true })

    if (!maskCtx) return

    if (useImage && imageSrc) {
      await new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const imgWidth = img.naturalWidth || img.width
          const imgHeight = img.naturalHeight || img.height
          const fitScale = Math.min(
            (width * 0.88) / imgWidth,
            (height * 0.72) / imgHeight,
          )
          const scale = fitScale * imageScale
          const drawWidth = imgWidth * scale
          const drawHeight = imgHeight * scale
          const offsetX = (width - drawWidth) / 2
          const offsetY = (height - drawHeight) / 2

          maskCtx.clearRect(0, 0, width, height)
          maskCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
          resolve()
        }
        img.onerror = () => reject(new Error('Image introuvable'))
        img.src = imageSrc
      }).catch(() => {
        drawTextMask(maskCtx, width, height, text)
      })
    } else {
      drawTextMask(maskCtx, width, height, text)
    }

    particlesRef.current = sampleParticlesFromCanvas(
      maskCtx,
      width,
      height,
      particleGap,
      particleSize,
      grainMode,
    )

    setIsReady(true)
    setIsLoading(false)
  }, [grainMode, imageScale, imageSrc, particleGap, particleSize, text, useImage])

  /**
   * Boucle d’animation — attraction ou répulsion curseur + retour vers la base.
   */
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const { width, height, dpr } = sizeRef.current
    const particles = particlesRef.current

    if (!canvas || !particles.length) {
      animationRef.current = window.requestAnimationFrame(animate)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pointer = pointerRef.current
    const radiusSq = mouseRadius * mouseRadius
    const reducedMotion = reducedMotionRef.current

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    if (backgroundColor === 'transparent') {
      ctx.clearRect(0, 0, width, height)
    } else {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)
    }

    const [r, g, b] = particleRgb

    for (const particle of particles) {
      if (!reducedMotion && pointer.active) {
        const toPointerX = pointer.x - particle.x
        const toPointerY = pointer.y - particle.y
        const distSq = toPointerX * toPointerX + toPointerY * toPointerY

        if (distSq < radiusSq && distSq > 0.0001) {
          const dist = Math.sqrt(distSq)
          const influence = 1 - dist / mouseRadius
          const pull = force * influence * influence
          const dirX = toPointerX / dist
          const dirY = toPointerY / dist
          const sign = pointerMode === 'attract' ? 1 : -1

          particle.vx += dirX * pull * sign
          particle.vy += dirY * pull * sign
        }
      }

      if (!reducedMotion) {
        particle.vx += (particle.baseX - particle.x) * returnSpeed
        particle.vy += (particle.baseY - particle.y) * returnSpeed
        particle.vx *= FRICTION
        particle.vy *= FRICTION
        particle.x += particle.vx
        particle.y += particle.vy
      } else {
        particle.x = particle.baseX
        particle.y = particle.baseY
        particle.vx = 0
        particle.vy = 0
      }

      ctx.globalAlpha = particle.alpha
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`

      if (grainMode) {
        const size = Math.max(1, particle.size)
        ctx.fillRect(
          particle.x - size * 0.5,
          particle.y - size * 0.5,
          size,
          size,
        )
      } else {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.globalAlpha = 1
    animationRef.current = window.requestAnimationFrame(animate)
  }, [
    backgroundColor,
    force,
    mouseRadius,
    grainMode,
    particleRgb,
    pointerMode,
    returnSpeed,
  ])

  /**
   * Coordonnées pointeur relatives au canvas (souris + tactile).
   */
  const updatePointer = useCallback(
    (clientX: number, clientY: number, active: boolean) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      pointerRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        active,
      }
    },
    [],
  )

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches
    }

    media.addEventListener('change', onMotionChange)
    return () => media.removeEventListener('change', onMotionChange)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setIsReady(false)
    void buildParticles()
  }, [buildParticles])

  useEffect(() => {
    if (!isReady) return

    animationRef.current = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationRef.current)
    }
  }, [animate, isReady])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver(() => {
      void buildParticles()
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [buildParticles])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY, true)
    }

    const onPointerLeave = () => {
      pointerRef.current.active = false
    }

    const onPointerDown = (event: PointerEvent) => {
      canvas.setPointerCapture(event.pointerId)
      updatePointer(event.clientX, event.clientY, true)
    }

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointerleave', onPointerLeave)
    canvas.addEventListener('pointerup', onPointerLeave)
    canvas.addEventListener('pointercancel', onPointerLeave)

    return () => {
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('pointerup', onPointerLeave)
      canvas.removeEventListener('pointercancel', onPointerLeave)
    }
  }, [updatePointer, isReady])

  return (
    <div
      ref={containerRef}
      className={`particle-logo-effect${isLoading ? ' particle-logo-effect--loading' : ''}${className ? ` ${className}` : ''}`}
      style={{ backgroundColor, ...style }}
      aria-hidden={!isReady}
    >
      {isLoading && (
        <span className="particle-logo-effect__loader" aria-live="polite">
          Chargement…
        </span>
      )}
      <canvas ref={canvasRef} className="particle-logo-effect__canvas" />
    </div>
  )
}
