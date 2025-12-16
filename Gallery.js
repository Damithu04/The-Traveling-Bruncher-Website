document.addEventListener('DOMContentLoaded', () => {
    // Get DOM Elements
    const loader = document.getElementById('loader');

    // Loader Logic
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 2000); // Loader stays for 2 seconds
    }

    const modal = document.getElementById('lightbox');
    const modalImg = document.getElementById("lightbox-img");
    const captionText = document.getElementById("caption");
    const closeBtn = document.getElementsByClassName("close-lightbox")[0];
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Add click event to all gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            const title = this.querySelector('h3')?.innerText || '';
            const desc = this.querySelector('p')?.innerText || '';

            modal.style.display = "block";
            modalImg.src = img.src;
            // Combine title and description for caption if they exist
            captionText.innerHTML = title ? `<strong>${title}</strong><br>${desc}` : '';

            // Disable body scroll when lightbox is open
            document.body.style.overflow = 'hidden';
        });
    });

    // Close Modal Function
    function closeModal() {
        modal.style.display = "none";
        // Re-enable body scroll
        document.body.style.overflow = 'auto';
    }

    // Close when clicking the 'x'
    closeBtn.onclick = function () {
        closeModal();
    }

    // Close when clicking outside the image background
    modal.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    }

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});