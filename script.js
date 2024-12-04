// Function to display the current date
function displayCurrentDate() {
    const dateElement = document.getElementById('current-date');
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);
    dateElement.textContent = `Today's Date: ${formattedDate}`;
}

function setDOBMaxDate() {
    const dobField = document.getElementById('dob-field');
    const today = new Date().toISOString().split('T')[0];
    dobField.setAttribute('max', today);
}

// Object to track form errors
let formErrors = {};




// cookies
// Utility: Set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Expiry in days
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
}

// Utility: Get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// Utility: Delete a cookie
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Handle Welcome Greeting
function handleGreeting() {
    const firstName = getCookie('firstName');
    const greetingMessage = document.getElementById('greeting-message');
    const firstNameField = document.querySelector('input[name="first_name"]');

    if (firstName) {
        // Returning user
        greetingMessage.innerHTML = `
            Welcome back, ${firstName}!
            <label>
                <input type="checkbox" id="new-user"> Not ${firstName}? Start as a new user.
            </label>
        `;
        firstNameField.value = firstName;

        // Handle "New User" checkbox
        document.getElementById('new-user').addEventListener('change', function () {
            if (this.checked) {
                deleteCookie('firstName');
                document.getElementById('registration-form').reset();
                greetingMessage.innerHTML = "Welcome New User!";
            }
        });
    } else {
        // New user
        greetingMessage.textContent = 'Welcome New User!';
    }
}

// Save First Name on Submit
function saveFirstName() {
    const firstName = document.querySelector('input[name="first_name"]').value.trim();
    const rememberMe = document.getElementById('remember-me').checked;

    if (firstName && rememberMe) {
        setCookie('firstName', firstName, 2); // Save cookie for 2 days
    }
}


////////////////////////////////////////////////////////////////


function validateField(field) {
    let errorMessage = '';
    const fieldId = field.id;
    const fieldValue = field.value.trim();

    // Validation logic based on field
    if (fieldId === 'first_name' && !/^[a-zA-Z'-]{1,30}$/.test(fieldValue)) {
        errorMessage = 'First name should only contain letters, apostrophes, and dashes.';
    }

    if (errorMessage) {
        formErrors[fieldId] = true;
        displayError(fieldId, errorMessage);
    } else {
        delete formErrors[fieldId];
        clearError(fieldId);
    }

    toggleSubmitButton();
}

function displayError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    document.getElementById(fieldId).style.backgroundColor = '#ffdddd';
}

function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    errorElement.textContent = '';
    document.getElementById(fieldId).style.backgroundColor = '';
}

function toggleSubmitButton() {
    const submitButton = document.getElementById('submit-btn');
    submitButton.disabled = Object.keys(formErrors).length > 0;
}

function validatePasswords() {
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirm_password"]').value;
    const userId = document.querySelector('input[name="user_id"]').value;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordPattern.test(password)) {
        alert('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
        return false;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }
    if (password.toLowerCase().includes(userId.toLowerCase())) {
        alert('Password cannot contain or match the User ID.');
        return false;
    }
    return true;
}

function updateSliderValue(value) {
    document.getElementById('slider-value').textContent = value;
}


// Validate function to show error messages
function showError(input, message) {
    const errorElement = input.nextElementSibling; // Assumes error span is right after input
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    input.style.borderColor = 'red';
}

// Clear error when corrected
function clearError(input) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = '';
    input.style.borderColor = '';
}

// First name validation
function validateFirstName() {
    const firstName = document.querySelector('input[name="first_name"]');
    if (firstName.value.length < 1 || firstName.value.length > 30 || /[^a-zA-Z'\-]/.test(firstName.value)) {
        showError(firstName, "First name must be 1-30 characters with letters, apostrophes, or dashes only.");
    } else {
        clearError(firstName);
    }
}

// Last name validation
function validateLastName() {
    const lastName = document.querySelector('input[name="last_name"]');
    if (lastName.value.length < 1 || lastName.value.length > 30 || /[^a-zA-Z'\-]/.test(lastName.value)) {
        showError(lastName, "Last name must be 1-30 characters with letters, apostrophes, or dashes only.");
    } else {
        clearError(lastName);
    }
}

// Email validation
function validateEmail() {
    const email = document.querySelector('input[name="email"]');
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
    if (!emailPattern.test(email.value)) {
        showError(email, "Enter a valid email in the format name@domain.tld.");
    } else {
        clearError(email);
    }
}

// Attach event listeners
document.querySelector('input[name="first_name"]').addEventListener('input', validateFirstName);
document.querySelector('input[name="first_name"]').addEventListener('blur', validateFirstName);
document.querySelector('input[name="last_name"]').addEventListener('input', validateLastName);
document.querySelector('input[name="last_name"]').addEventListener('blur', validateLastName);
document.querySelector('input[name="email"]').addEventListener('input', validateEmail);
document.querySelector('input[name="email"]').addEventListener('blur', validateEmail);

// Final validation on submit
document.querySelector('form').onsubmit = function(event) {
    validateFirstName();
    validateLastName();
    validateEmail();
    // Additional validation functions here

    if (document.querySelectorAll('.error:empty').length === 0) {
        event.preventDefault(); // Stop form submission if there are errors
    }
};




// Function to display error messages in red next to the input fields
function displayError(inputField, message) {
    let errorSpan = inputField.nextElementSibling;
    if (!errorSpan || !errorSpan.classList.contains("error-message")) {
        errorSpan = document.createElement("span");
        errorSpan.className = "error-message";
        inputField.parentNode.insertBefore(errorSpan, inputField.nextSibling);
    }
    errorSpan.style.color = "red";
    errorSpan.textContent = message;
}

// Function to clear error message if input is correct
function clearError(inputField) {
    let errorSpan = inputField.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains("error-message")) {
        errorSpan.textContent = "";
    }
}

// Phone number validation (expects a format like 123-456-7890)
function validatePhoneNumber() {
    const phoneField = document.getElementById("phone");
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    if (!phonePattern.test(phoneField.value)) {
        displayError(phoneField, "Phone number must be in the format 123-456-7890.");
    } else {
        clearError(phoneField);
    }
}

// Address validation for required fields and length
function validateAddress() {
    const addressField = document.getElementById("address");
    if (addressField.value.length < 2 || addressField.value.length > 30) {
        displayError(addressField, "Address must be between 2 and 30 characters.");
    } else {
        clearError(addressField);
    }
}

// Event listeners for oninput and onblur validation
document.getElementById("phone").addEventListener("input", validatePhoneNumber);
document.getElementById("phone").addEventListener("blur", validatePhoneNumber);

document.getElementById("address").addEventListener("input", validateAddress);
document.getElementById("address").addEventListener("blur", validateAddress);

// Example of validating all fields on submit
document.querySelector("form").onsubmit = function(event) {
    // Validate all fields again before submitting
    validatePhoneNumber();
    validateAddress();
    if (document.querySelectorAll(".error-message:empty").length !== 0) {
        event.preventDefault(); // Stop submission if there are errors
    }
};





document.getElementById('registration-form').onsubmit = function(event) {
    const formFields = document.querySelectorAll('#registration-form input');
    formFields.forEach(field => validateField(field));
    
    if (Object.keys(formErrors).length > 0 || !validatePasswords()) {
        event.preventDefault();
    }
};



window.onload = function () {
    displayCurrentDate(); // Existing function
    setDOBMaxDate(); // Existing function
    handleGreeting(); // New function

    // Add event listeners for validation and review
    const formFields = document.querySelectorAll('#registration-form input');
    formFields.forEach(field => {
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('blur', () => validateField(field));
    });

    document.getElementById('review-btn').addEventListener('click', reviewFormData);
    document.getElementById('registration-form').addEventListener('submit', saveFirstName);
};
