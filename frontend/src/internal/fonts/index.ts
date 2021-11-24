import iconFontEOT from '../../assets/fonts/icons/font/webfont.eot'
import iconFontTTF from '../../assets/fonts/icons/font/webfont.ttf'
import iconFontWOFF from '../../assets/fonts/icons/font/webfont.woff'
import iconFontWOFF2 from '../../assets/fonts/icons/font/webfont.woff2'
import passwordFontEOT from '../../assets/fonts/passdot/font/webfont.eot'
import passwordFontTTF from '../../assets/fonts/passdot/font/webfont.ttf'
import passwordFontWOFF from '../../assets/fonts/passdot/font/webfont.woff'
import passwordFontWOFF2 from '../../assets/fonts/passdot/font/webfont.woff2'

export const fontCSS = `
@font-face {
  font-family: "__passdot";
  src: url("${passwordFontEOT}");
  src: url("${passwordFontEOT}") format("embedded-opentype"),
       url("${passwordFontWOFF2}") format('woff2'),
       url("${passwordFontWOFF}") format('woff'),
       url("${passwordFontTTF}") format('truetype');
}

@font-face {
  font-family: "__icons";
  src: url("${iconFontEOT}");
  src: url("${iconFontEOT}") format("embedded-opentype"),
       url("${iconFontWOFF2}") format('woff2'),
       url("${iconFontWOFF}") format('woff'),
       url("${iconFontTTF}") format('truetype');
}
`

export function init (): void {
  const el = document.createElement('style')
  el.innerHTML = fontCSS
  document.head.appendChild(el)
}
