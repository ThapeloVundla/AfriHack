/* ── Landing page ── */

// Smooth-scroll for anchor links inside the page
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Swap header style when scrolled past the hero
var header = document.querySelector('.site-header');
var hero = document.querySelector('.hero');

if (header && hero) {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          header.classList.remove('scrolled');
        } else {
          header.classList.add('scrolled');
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(hero);
}
