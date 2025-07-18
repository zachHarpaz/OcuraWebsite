document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Handle form submission
    const waitlistForm = document.getElementById('waitlistForm');
    const formMessage = document.getElementById('formMessage');
    let errorTimeout = null;

    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear any existing error timeout
        if (errorTimeout) {
            clearTimeout(errorTimeout);
        }

        // Get form data
        const formData = new FormData(waitlistForm);
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            profession: formData.get('profession')
        };

        // Validate form data
        if (!validateForm(data)) {
            // Set timeout to clear error message
            errorTimeout = setTimeout(() => {
                formMessage.style.display = 'none';
            }, 3000); // Error message disappears after 3 seconds
            return;
        }

        // Add loading state
        const submitButton = waitlistForm.querySelector('button');
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
        submitButton.disabled = true;

        try {
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Get current waitlist count and increment
            const waitlist = JSON.parse(localStorage.getItem('ocuraWaitlist') || '[]');
            const waitlistNumber = waitlist.length + 1;
            
            // Store in localStorage
            waitlist.push({
                ...data,
                waitlistNumber,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('ocuraWaitlist', JSON.stringify(waitlist));

            // Store the user's waitlist number for the success page
            localStorage.setItem('lastWaitlistNumber', waitlistNumber.toString());

            // Redirect to success page
            window.location.href = 'success.html';
        } catch (error) {
            showError('Oops! Something went wrong. Please try again.');
            errorTimeout = setTimeout(() => {
                formMessage.style.display = 'none';
            }, 3000);
        } finally {
            // Reset button state
            submitButton.innerHTML = 'Join Waitlist';
            submitButton.disabled = false;
        }
    });

    // Form validation
    function validateForm(data) {
        // Reset previous error messages
        formMessage.className = 'form-message';
        formMessage.textContent = '';

        // Validate all fields at once and show the first error
        if (!data.fullName || data.fullName.trim().length < 2) {
            showError('Please enter your full name');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showError('Please enter a valid email address');
            return false;
        }

        if (!data.profession) {
            showError('Please select your role');
            return false;
        }

        return true;
    }

    // Show error message
    function showError(message) {
        formMessage.className = 'form-message error';
        formMessage.textContent = message;
        formMessage.style.display = 'block';
    }

    // Check if we're on the success page and show waitlist number
    if (window.location.pathname.includes('success.html')) {
        const waitlistNumber = localStorage.getItem('lastWaitlistNumber');
        if (waitlistNumber) {
            // Create waitlist number display
            const successContent = document.querySelector('.success-content');
            const waitlistDisplay = document.createElement('div');
            waitlistDisplay.className = 'waitlist-number';
            waitlistDisplay.innerHTML = `
                <h3>Your Waitlist Position</h3>
                <div class="number">#${waitlistNumber}</div>
            `;
            
            // Insert after the success message
            const successMessage = document.querySelector('.success-message');
            if (successMessage) {
                successMessage.after(waitlistDisplay);
            }
        }
    }
});

// Share buttons functionality
document.querySelectorAll('.share-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const text = 'Join me on Ocura - the future of healthcare data management!';
        const url = window.location.origin;
        let shareUrl;

        if (button.classList.contains('twitter')) {
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        } else if (button.classList.contains('linkedin')) {
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        } else if (button.classList.contains('facebook')) {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    });
}); 