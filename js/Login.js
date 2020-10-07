function login() {
    var userEmail = $("#email_field").val();
    var userPass = $("#password_field").val();
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(error => {
        // Handle Errors here
        var errorMessage = error.message;
        $("#loginAlert").text("Error: " + errorMessage);
    });
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            window.location.href = "Administracija.html";
        }
        else {

        }
    });
    console.log("works");
    //Brisanje vrijednosti iz ispuna za prijavu
    $("#email_field").val('');
    $("#password_field").val('');
}

function logout() {
    firebase.auth().signOut();
    window.location.href = "zRadovi.html";
}