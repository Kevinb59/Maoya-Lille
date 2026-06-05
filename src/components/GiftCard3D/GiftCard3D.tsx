import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { homeAssets } from '@/lib/assets'
import './GiftCard3D.css'

/* Recto / verso — public/assets/pages/home/intro/images/ */
const INTRO_FRONT = homeAssets.intro.image
const INTRO_BACK = homeAssets.intro.imageVerso

/** Ratio des .webp intro / intro2 (1200×800) */
const CARD_ASPECT = 3 / 2
const CARD_WIDTH = 3.4
const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT
/** Épaisseur fine (carte plastique, pas bloc) */
const CARD_THICKNESS = 0.036
const CARD_RADIUS = 0.14
const FACE_GAP = 0.012
const AUTO_ROTATE_SPEED = 0.65
const DRAG_SENSITIVITY = 0.01
const MAX_TILT_X = 1.1
/** Inclinaison fixe : haut de la carte vers l'arrière (degrés → radians) */
const CARD_PITCH = THREE.MathUtils.degToRad(-18)
/** Décalage vertical dans la scène (espace libre en bas du canvas) */
const CARD_OFFSET_Y = -0.36

export type GiftCard3DProps = {
  frontSrc?: string
  backSrc?: string
  className?: string
}

function createRoundedRectangleShape(
  width: number,
  height: number,
  radius: number,
): THREE.Shape {
  const x = -width / 2
  const y = -height / 2
  const w = width
  const h = height
  const r = Math.min(radius, width / 2, height / 2)

  const shape = new THREE.Shape()

  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)

  return shape
}

/**
 * Recalcule les UV en projection planaire (0→1 sur toute la face).
 * ShapeGeometry génère des UV incorrects → étirement et répétition visibles.
 */
function remapPlanarUVs(
  geometry: THREE.BufferGeometry,
  mirrorX = false,
): void {
  geometry.computeBoundingBox()
  const bbox = geometry.boundingBox
  if (!bbox) return

  const width = bbox.max.x - bbox.min.x
  const height = bbox.max.y - bbox.min.y
  if (width === 0 || height === 0) return

  const positions = geometry.attributes.position
  const uvArray = new Float32Array(positions.count * 2)

  for (let i = 0; i < positions.count; i++) {
    let u = (positions.getX(i) - bbox.min.x) / width
    const v = (positions.getY(i) - bbox.min.y) / height
    if (mirrorX) u = 1 - u
    uvArray[i * 2] = u
    uvArray[i * 2 + 1] = v
  }

  geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2))
}

function prepareCardTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.repeat.set(1, 1)
  texture.offset.set(0, 0)
  texture.anisotropy = 8
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

type CardMeshProps = {
  frontSrc: string
  backSrc: string
}

function CardMesh({ frontSrc, backSrc }: CardMeshProps) {
  const { gl } = useThree()
  const autoRotationRef = useRef<THREE.Group>(null)
  const cardRef = useRef<THREE.Group>(null)
  const dragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })

  const [frontTexture, backTexture] = useTexture([frontSrc, backSrc])

  useEffect(() => {
    prepareCardTexture(frontTexture)
    prepareCardTexture(backTexture)
  }, [frontTexture, backTexture])

  /* Corps extrudé + faces (même forme arrondie, UV recalculées par face) */
  const { edgeGeometry, faceGeometryFront, faceGeometryBack, faceZ } =
    useMemo(() => {
    const shape = createRoundedRectangleShape(
      CARD_WIDTH,
      CARD_HEIGHT,
      CARD_RADIUS,
    )

    const faceGeometryFront = new THREE.ShapeGeometry(shape, 32)
    remapPlanarUVs(faceGeometryFront, false)

    const faceGeometryBack = faceGeometryFront.clone()
    remapPlanarUVs(faceGeometryBack, false)

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: CARD_THICKNESS,
      bevelEnabled: true,
      bevelSize: 0.006,
      bevelThickness: 0.006,
      bevelSegments: 2,
      curveSegments: 24,
      steps: 1,
    })

    geometry.center()
    geometry.computeBoundingBox()

    const halfZ =
      geometry.boundingBox?.max.z ?? CARD_THICKNESS / 2 + 0.006

    return {
      edgeGeometry: geometry,
      faceGeometryFront,
      faceGeometryBack,
      faceZ: halfZ + FACE_GAP,
    }
  }, [])

  useFrame((_, delta) => {
    if (!autoRotationRef.current || !cardRef.current) return

    if (!dragging.current) {
      autoRotationRef.current.rotation.y += delta * AUTO_ROTATE_SPEED

      cardRef.current.rotation.x = THREE.MathUtils.damp(
        cardRef.current.rotation.x,
        0,
        6,
        delta,
      )
      cardRef.current.rotation.y = THREE.MathUtils.damp(
        cardRef.current.rotation.y,
        0,
        6,
        delta,
      )
      cardRef.current.rotation.z = THREE.MathUtils.damp(
        cardRef.current.rotation.z,
        0,
        6,
        delta,
      )
    }
  })

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    dragging.current = true
    lastPointer.current = { x: event.clientX, y: event.clientY }
    gl.domElement.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging.current || !cardRef.current) return

    const deltaX = event.clientX - lastPointer.current.x
    const deltaY = event.clientY - lastPointer.current.y

    cardRef.current.rotation.y += deltaX * DRAG_SENSITIVITY
    cardRef.current.rotation.x += deltaY * DRAG_SENSITIVITY
    cardRef.current.rotation.x = THREE.MathUtils.clamp(
      cardRef.current.rotation.x,
      -MAX_TILT_X,
      MAX_TILT_X,
    )

    lastPointer.current = { x: event.clientX, y: event.clientY }
  }

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    dragging.current = false
    gl.domElement.releasePointerCapture(event.pointerId)
  }

  return (
    <group
      position={[0, CARD_OFFSET_Y, 0]}
      rotation={[CARD_PITCH, 0, 0]}
      scale={0.88}
    >
      <group ref={autoRotationRef}>
        <group
          ref={cardRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
        <mesh geometry={edgeGeometry} renderOrder={0}>
          <meshStandardMaterial
            color="#6d3554"
            roughness={0.45}
            metalness={0.15}
          />
        </mesh>

        {/* Faces : ShapeGeometry + UV planaires (une image = une face entière) */}
        <mesh geometry={faceGeometryFront} position={[0, 0, faceZ]} renderOrder={2}>
          <meshBasicMaterial
            map={frontTexture}
            toneMapped={false}
            depthWrite
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>

        <mesh
          geometry={faceGeometryBack}
          position={[0, 0, -faceZ]}
          rotation={[0, Math.PI, 0]}
          renderOrder={2}
        >
          <meshBasicMaterial
            map={backTexture}
            toneMapped={false}
            depthWrite
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
        </group>
      </group>
    </group>
  )
}

function TransparentScene() {
  const { scene } = useThree()

  useEffect(() => {
    scene.background = null
  }, [scene])

  return null
}

export function GiftCard3D({
  frontSrc = INTRO_FRONT,
  backSrc = INTRO_BACK,
  className = '',
}: GiftCard3DProps) {
  const rootClass = className
    ? `gift-card-3d ${className}`
    : 'gift-card-3d'

  return (
    <div
      className={rootClass}
      aria-label="Carte cadeau Maoya — manipulation 3D au survol (desktop)"
    >
      {/* Viewport fixe = taille de la carte ; le parent ajoute de la marge anti-rognage */}
      <div className="gift-card-3d__viewport">
        {/* Voile mobile — laisse passer le scroll, bloque le drag sur la carte (≤900px) */}
        <div className="gift-card-3d__scroll-shield" aria-hidden="true" />
        <Canvas
        dpr={[1, 2]}
        camera={{
          position: [0, 0.28, 5.6],
          fov: 38,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <TransparentScene />
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[2, 3, 4]} intensity={1.4} />
          <directionalLight position={[-3, -1, 2]} intensity={0.5} />

          <CardMesh frontSrc={frontSrc} backSrc={backSrc} />
        </Suspense>
      </Canvas>
      </div>
    </div>
  )
}

export default GiftCard3D
