// Function to open the popup
function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

// Function to close the popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Function to handle form submission
function submitForm() {
    let email = document.getElementById("email").value;

    if (email === "") {
        alert("Please enter a valid email address.");
    } else {
        alert("Thank you for applying for the discount! We’ll notify you soon.");
        document.getElementById("email").value = ""; 
        closePopup();
    }
}

   // Optional: Smooth scrolling effect for anchor links
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
