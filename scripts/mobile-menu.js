(function () {
    var btn = document.getElementById('mobile-menu-btn');
    var overlay = document.getElementById('mobile-overlay');
    var navbar = document.querySelector('.navbar');

    if (!btn || !navbar) return;

    function openNav() {
        navbar.classList.add('mobile-open');
        if (overlay) overlay.classList.add('active');
        btn.classList.add('active');
        document.body.classList.add('nav-open');
    }

    function closeNav() {
        navbar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('active');
        btn.classList.remove('active');
        document.body.classList.remove('nav-open');
    }

    btn.addEventListener('click', function () {
        navbar.classList.contains('mobile-open') ? closeNav() : openNav();
    });

    if (overlay) overlay.addEventListener('click', closeNav);

    navbar.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeNav);
    });
})();
