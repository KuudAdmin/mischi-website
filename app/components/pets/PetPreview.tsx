'use client'

import Image from 'next/image'
import PetCanvas from '../demo/PetCanvas'
import { useInView } from '../useInView'

interface PetPreviewProps {
  name: string
  previewSrc: string
  spritesheetSrc: string
  eager?: boolean
}

export default function PetPreview({ name, previewSrc, spritesheetSrc, eager = false }: PetPreviewProps) {
  const [ref, inView] = useInView<HTMLDivElement>({
    once: true,
    rootMargin: '360px 0px',
    threshold: 0.01,
  })
  const showAnimated = eager || inView

  return (
    <div ref={ref} className="pets-preview" aria-label={`${name} preview`}>
      {showAnimated ? (
        <PetCanvas
          spritesheet={spritesheetSrc}
          interactive={false}
          autoAnimate={false}
          scale={0.74}
          repeatShortAnims
        />
      ) : (
        <Image
          src={previewSrc}
          alt=""
          width={256}
          height={277}
          sizes="150px"
          priority={eager}
          className="pets-preview-image"
        />
      )}
    </div>
  )
}
