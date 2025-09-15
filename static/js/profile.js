document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');

    container.addEventListener('mouseover', () => {
        container.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
    });

    container.addEventListener('mouseleave', () => {
        container.style.boxShadow = '0 14px 28px rgba(0,0,0,0.4), 0 10px 10px rgba(0,0,0,0.3)';
    });
});
