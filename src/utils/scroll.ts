/**
 * @file Scroll to anywhere
 * @author Surmon <https://github.com/surmon-china>
 */

export const scrollToTop = () => {
  document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
}
