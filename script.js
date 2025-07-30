const buttonAcceder = document.getElementById('button_acceder');
const loadingOverlay = document.getElementById('loading-overlay');

buttonAcceder.addEventListener('click', () => {
    loadingOverlay.classList.remove('hidden');

    setTimeout(() => {
        window.location.href = 'pagina_balance.html';
    }, 2000);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration);
            })
            .catch(error => {
                console.log('Fallo el registro del Service Worker:', error);
            });
    });
}
























