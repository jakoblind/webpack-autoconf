export function trackPageView(newUrl) {
  if (!window.ga) {
    return
  }
  window.ga('set', 'page', newUrl)
  window.ga('send', 'pageview')
}

export function gaSendEvent({ eventCategory, eventAction, eventLabel }) {
  if (!window.ga) {
    console.log(
      'Ga debug: ',
      'send',
      'event',
      eventCategory,
      eventAction,
      eventLabel
    )
    return
  }
  window.ga('send', 'event', eventCategory, eventAction, eventLabel)
}
