window.onhashchange = function () {
  switchLang(location.hash.substring(2) || 'de')
}
function initTranslation () {
  const lang = location.hash.substring(2)
  if (lang === 'de') {
    return
  }
  if (lang === 'en' || (!navigator.languages.includes('de') && !navigator.languages.includes('de-DE'))) {
    window.history.replaceState('', '', '#/en')
    switchLang('en')
  }
}
function switchLang (lang) {
  if (lang !== 'de') {
    document.getElementsByTagName('html')[0].setAttribute('lang', 'en')
    document.getElementById('en').classList.add('dn')
    document.getElementById('de').classList.remove('dn')
    translate()
    return
  }
  location.reload()
}
async function translate () {
  for (const [key, value] of Object.entries(translation)) {
    const element = document.querySelector(`[data-i18n="${key}"]`)
    element.innerHTML = value
  }
}
