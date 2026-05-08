document.addEventListener('DOMContentLoaded', async () => {
    async function inject(id, url) {
        const res = await fetch(url);
        const html = await res.text();
        const el = document.getElementById(id);
        if (el) el.outerHTML = html;
    }

    await Promise.all([
        inject('site-header', 'header.html'),
        inject('site-footer', 'footer.html'),
    ]);

    const currentPage = location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('header nav a[data-page]').forEach(a => {
        if (a.dataset.page === currentPage) {
            a.classList.remove('text-secondary', 'dark:text-secondary-fixed-dim');
            a.classList.add('font-bold', 'border-b-2', 'border-primary',
                'dark:border-primary-fixed', 'pb-1', 'text-primary',
                'dark:text-primary-fixed', 'opacity-80');
        }
    });
});
