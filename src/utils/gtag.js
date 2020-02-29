export const reportEvent = (event, category, label, value) => {
  window.gtag('event', event, {
    event_category: category,
    event_label: label,
    value
  })
}
