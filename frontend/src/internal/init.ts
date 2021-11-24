import { init as initFonts } from './fonts'
import { init as initI18n } from './i18n'

/**
 * 컴포넌트 라이브러리를 초기화 합니다.
 */
const init = async (): Promise<void> => {
  await initI18n()
  await initFonts()
}
export default init
