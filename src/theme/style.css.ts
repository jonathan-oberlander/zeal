import { globalStyle, globalFontFace } from '@vanilla-extract/css'

const geist = 'Geist'

globalFontFace(geist, {
  src: `url('/fonts/Geist-Regular.woff2') format('woff2')`,
  fontWeight: 400,
  fontStyle: 'normal',
  fontDisplay: 'swap',
})

globalStyle('html, body', {
  margin: 0,
  fontFamily: geist,
  boxSizing: 'border-box',
})

globalStyle('body', {
  margin: 0,
  padding: 0,
})
