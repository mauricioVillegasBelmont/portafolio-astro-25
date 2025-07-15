const navLinks = document.querySelectorAll("[data-navLink]");

navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (href !== null) {
    const linkUrl = new URL(href, window.location.origin);
    const isSameOrigin = linkUrl.origin === window.location.origin;
    if (isSameOrigin && linkUrl.pathname === window.location.pathname) {
      link.setAttribute("aria-current", "page");
      link.setAttribute("disabled", "true");
    }
    if (!isSameOrigin) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer noopener");
    }
  } else {
    link.setAttribute("disabled", "true");
  }
});