import type { PlasmoCSConfig } from "plasmo"

// 1. CONFIGURATION : C'est ici qu'on dit à Chrome/Firefox où ce script doit s'activer
// Remplace la section "content_scripts" de votre ancien manifest.json
export const config: PlasmoCSConfig = {
  matches: ["https://www.ent-ecole.fr/*"],
  run_at: "document_idle" // Plus besoin de setTimeout arbitraire, on attend que la page soit calme
}

// 2. VOTRE FONCTION UTILITAIRE (inchangée)
function sendCharacter(element, char) {
    var keydownEvent = new KeyboardEvent('keydown', { key: char, code: 'Key' + char.toUpperCase(), keyCode: char.charCodeAt(0), charCode: char.charCodeAt(0), which: char.charCodeAt(0), bubbles: true, cancelable: true });
    element.dispatchEvent(keydownEvent);
    // ... (le reste de vos événements pour simuler la frappe)
    var inputEvent = new InputEvent('input', { bubbles: true, cancelable: true, data: char, inputType: 'insertText' });
    element.value += char;
    element.dispatchEvent(inputEvent);
}

// 3. LOGIQUE PRINCIPALE
window.addEventListener('load', function () {
    const page_en_cours = window.location.href;
    console.log("Plasmo Content Script Active sur :", page_en_cours);

    if (page_en_cours.includes("/auth/login")) {
        // Petit délai de sécurité si le framework React est lent à afficher les champs
        setTimeout(function () {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            const storedLogin = params.get('a');
            const storedPassword = params.get('b');

            if (storedLogin && storedPassword) {
                // ATTENTION : Les IDs comme ":r5:" sont souvent dynamiques (générés par React/MUI)
                // Ils risquent de changer à la prochaine mise à jour du site de l'école.
                // Je recommande de cibler par attribut si possible, sinon on garde vos IDs.
                
                var loginInput = document.getElementById(":r5:"); 
                // Alternative plus robuste si les IDs changent : 
                // var loginInput = document.querySelector('input[type="text"]') || document.getElementById(":r5:");

                var passwordInput = document.getElementById(":r6:");
                // var passwordInput = document.querySelector('input[type="password"]') || document.getElementById(":r6:");
                
                var submitButton = document.getElementById(":r7:");
                // var submitButton = document.querySelector('button[type="submit"]') || document.getElementById(":r7:");

                if (loginInput && passwordInput && submitButton) {
                    for (var i = 0; i < storedLogin.length; i++) sendCharacter(loginInput, storedLogin[i]);
                    for (var i = 0; i < storedPassword.length; i++) sendCharacter(passwordInput, storedPassword[i]);
                    
                    // Optionnel : Nettoyer l'URL pour ne pas laisser le mot de passe visible dans l'historique
                    // window.history.replaceState({}, document.title, window.location.pathname);
                    
                    submitButton.click();
                } else {
                    console.error("Champs de connexion introuvables (les IDs ont peut-être changé ?)");
                }
            }
        }, 1000); 
    }
});