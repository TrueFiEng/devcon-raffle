import RegolaProBoldWoff from './fonts/RegolaPro/RegolaPro-Bold.woff'
import RegolaProBoldWoff2 from './fonts/RegolaPro/RegolaPro-Bold.woff2'
import RegolaProBoldObliqueWoff from './fonts/RegolaPro/RegolaPro-BoldOblique.woff'
import RegolaProBoldObliqueWoff2 from './fonts/RegolaPro/RegolaPro-BoldOblique.woff2'
import RegolaProMediumWoff from './fonts/RegolaPro/RegolaPro-Medium.woff'
import RegolaProMediumWoff2 from './fonts/RegolaPro/RegolaPro-Medium.woff2'
import RegolaProMediumObliqueWoff from './fonts/RegolaPro/RegolaPro-MediumOblique.woff'
import RegolaProMediumObliqueWoff2 from './fonts/RegolaPro/RegolaPro-MediumOblique.woff2'
import RegolaProRegularWoff from './fonts/RegolaPro/RegolaPro-Regular.woff'
import RegolaProRegularWoff2 from './fonts/RegolaPro/RegolaPro-Regular.woff2'
import RegolaProRegularObliqueWoff from './fonts/RegolaPro/RegolaPro-RegularOblique.woff'
import RegolaProRegularObliqueWoff2 from './fonts/RegolaPro/RegolaPro-RegularOblique.woff2'
import RegolaProSemiBoldWoff from './fonts/RegolaPro/RegolaPro-SemiBold.woff'
import RegolaProSemiBoldWoff2 from './fonts/RegolaPro/RegolaPro-SemiBold.woff2'
import RegolaProSemiBoldObliqueWoff from './fonts/RegolaPro/RegolaPro-SemiBoldOblique.woff'
import RegolaProSemiBoldObliqueWoff2 from './fonts/RegolaPro/RegolaPro-SemiBoldOblique.woff2'

export const fonts = `
  /* Regola Pro Font Family */

  @font-face {
    font-family: 'Regola Pro';
    src: url(${RegolaProRegularWoff2}) format('woff2'),
        url(${RegolaProRegularWoff}) format('woff');
    font-style: normal;
    font-weight: 400;
    font-display: swap;
  }

  @font-face {
    font-family: 'Regola Pro';
    src: url(${RegolaProMediumWoff2}) format('woff2'),
        url(${RegolaProMediumWoff}) format('woff');
    font-style: normal;
    font-weight: 500;
    font-display: swap;
  }

  @font-face {
    font-family: 'Regola Pro';
    src: url(${RegolaProSemiBoldWoff2}) format('woff2'),
        url(${RegolaProSemiBoldWoff}) format('woff');
    font-style: normal;
    font-weight: 600;
    font-display: swap;
  }

  font-face {
    font-family: 'Regola Pro';
    src: url(${RegolaProBoldWoff2}) format('woff2'),
        url(${RegolaProBoldWoff}) format('woff');
    font-style: normal;
    font-weight: 700;
    font-display: swap;
  }

  @font-face {
    font-family: 'Regola Pro';
    src: url(${RegolaProRegularObliqueWoff2}) format('woff2'),
        url(${RegolaProRegularObliqueWoff}) format('woff');
    font-style: oblique;
    font-weight: 400;
    font-display: swap;
  }

  @font-face {
    font-family: 'Regola Pro';
    src: url(${RegolaProMediumObliqueWoff2}) format('woff2'),
        url(${RegolaProMediumObliqueWoff}) format('woff');
    font-style: oblique;
    font-weight: 500;
    font-display: swap;
  }

  @font-face {
    font-family: 'Regola Pro';
    src: url(${RegolaProSemiBoldObliqueWoff2}) format('woff2'),
        url(${RegolaProSemiBoldObliqueWoff}) format('woff');
    font-style: oblique;
    font-weight: 600;
    font-display: swap;
  }

  font-face {
    font-family: 'Regola Pro';
    src: url(${RegolaProBoldObliqueWoff2}) format('woff2'),
        url(${RegolaProBoldObliqueWoff}) format('woff');
    font-style: oblique;
    font-weight: 700;
    font-display: swap;
  }
`
