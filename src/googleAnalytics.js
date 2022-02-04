const GA_CODE = 'UA-43679645-5';

export function trackPageView(newUrl) {
  if (!window.gtag) {
    return;
  }
  window.gtag('config', GA_CODE, {
    path_url: newUrl,
  });
}

export function gaSendEvent({ eventCategory, eventAction, eventLabel }) {
  if (!window.gtag) {
    console.log(
      'Ga debug: ',
      'send',
      'event',
      eventCategory,
      eventAction,
      eventLabel
    );
    return;
  }
  window.gtag('event', eventAction, {
    event_category: eventCategory,
    event_label: eventLabel,
  });
}
