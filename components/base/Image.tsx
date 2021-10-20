import { styled } from '@theme'
import NextImage from 'next/image'
import { useState } from 'react'

const Img = ({ sources = [], fallbackSrc, ...props }) => {
  const [erroredSourcesCount, setErroredSourcesCount] = useState(0)
  const [imgSrc, setImgSrc] = useState(sources[0] || fallbackSrc)
  return (
    <NextImage
      draggable={false}
      src={imgSrc}
      onError={() => {
        setImgSrc(sources[erroredSourcesCount + 1] || fallbackSrc)
        setErroredSourcesCount(erroredSourcesCount + 1)
      }}
      {...props}
    />
  )
}

export const Image = styled(Img, {
  width: 'auto',
  height: 'auto',
  userSelect: 'none',
})

// export const Image = (props: ImageProps) => <Img draggable={false} {...props} />
