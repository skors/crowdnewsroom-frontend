export function trackPageView(title) {
  if (window._paq) {
    window._paq.push(["trackPageView", title]);
  }
}

export function trackSubmission() {
  if (window._paq) {
    window._paq.push(["trackGoal", 1]);
  }
}
