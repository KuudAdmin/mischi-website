'use client'

import { useEffect, useRef, useState } from 'react'
import { DocumentDownload } from 'iconsax-react'

interface PetDownloadButtonProps {
  href: string
  name: string
  size: string
}

export default function PetDownloadButton({ href, name, size }: PetDownloadButtonProps) {
  const [loading, setLoading] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const handleClick = () => {
    setLoading(true)
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setLoading(false), 450)
  }

  return (
    <a
      href={href}
      download
      className="pet-download"
      data-loading={loading ? 'true' : undefined}
      aria-label={`Download ${name}`}
      aria-busy={loading ? 'true' : undefined}
      onClick={handleClick}
    >
      {loading ? (
        <span className="pet-download-spinner" aria-hidden="true" />
      ) : (
        <DocumentDownload size={17} variant="Bold" color="currentColor" aria-hidden="true" />
      )}
      {loading ? 'Starting...' : 'Download'}
      <span className="pet-download-size">{size}</span>
    </a>
  )
}
