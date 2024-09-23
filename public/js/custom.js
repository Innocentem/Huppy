document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('loginModal');
    const loginLink = document.getElementById('login-link');
    const modalTrigger = document.getElementById('login-modal-trigger');
    const closeModal = document.getElementById('closeModal');

    // Open modal when login link is clicked
    loginLink.addEventListener('click', function (e) {
        e.preventDefault();
        modal.style.display = 'block';
    });

    // Also open modal when "login here" is clicked
    modalTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        modal.style.display = 'block';
    });

    // Close modal when the close button is clicked
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'loginModal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closeModal">&times;</span>
            <h1>Login to Huppy</h1>
            <form action="/auth/login" method="POST">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" name="email" id="email" placeholder="Enter your email" required aria-required="true">
                </div>

                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" name="password" id="password" placeholder="Enter your password" required aria-required="true">
                </div>

                <div class="form-group">
                    <button type="submit">Login</button>
                </div>
            </form>
            <p>Don't have an account? <a href="#signup-section">Sign up here</a></p>
        </div>
    `;
    document.body.appendChild(modal);

    const loginLink = document.getElementById('login-link');
    const modalTrigger = document.getElementById('login-modal-trigger');
    const closeModal = document.getElementById('closeModal');

    // Open modal when login link is clicked
    loginLink.addEventListener('click', function (e) {
        e.preventDefault();
        modal.style.display = 'block';
    });

    // Also open modal when "login here" is clicked
    modalTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        modal.style.display = 'block';
    });

    // Close modal when the close button is clicked
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Get the signup section and signup links
const signupSection = document.getElementById('signup-section');
const signupLink = document.getElementById('signup-link');
const signupLinkNav = document.getElementById('signup-link-nav');

// Function to toggle visibility of signup section
function toggleSignupSection() {
    if (signupSection.style.display === 'none') {
        signupSection.style.display = 'block';
        signupSection.scrollIntoView({ behavior: 'smooth' }); // Scroll smoothly to the form
    } else {
        signupSection.style.display = 'none';
    }
}

// Add event listeners to signup links
signupLink.addEventListener('click', function(event) {
    event.preventDefault();
    toggleSignupSection();
});

signupLinkNav.addEventListener('click', function(event) {
    event.preventDefault();
    toggleSignupSection();
});

