import {
  createGlobalTheme,
  createGlobalThemeContract,
} from '@vanilla-extract/css'

export const vars = createGlobalThemeContract(
  {
    color: {
      deep: 'color-deep',
      shade: 'color-shade',
      shadeLight: 'color-shadeLight',
      light: 'color-light',
    },
    boxShadow: {
      primary: 'box-shadow-rimary',
    },
  },
  value => `base-${value}`,
)

export const theme = createGlobalTheme(':root', vars, {
  color: {
    deep: '#363062',
    shade: '#435585',
    shadeLight: '#818FB4',
    light: 'white',
  },
  boxShadow: {
    primary: '0 3px 10px 0 rgba(0,0,0,0.2), 0 10px 10px 0 rgba(0,0,0,0.19)',
  },
})
