import type { PlasmoCSConfig } from "plasmo"

// Activation du content script uniquement sur l’ENT
export const config: PlasmoCSConfig = {
  matches: ["https://www.ent-ecole.fr/*"],
  run_at: "document_idle"
}

// Simulation réaliste de frappe clavier
function sendCharacter(element: HTMLInputElement, char: string) {
  const keyCode = char.charCodeAt(0)

  const keydownEvent = new KeyboardEvent("keydown", {
    key: char,
    code: "Key" + char.toUpperCase(),
    keyCode,
    charCode: keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true
  })
  element.dispatchEvent(keydownEvent)

  const inputEvent = new InputEvent("input", {
    bubbles: true,
    cancelable: true,
    data: char,
    inputType: "insertText"
  })

  element.value += char
  element.dispatchEvent(inputEvent)

  const keyupEvent = new KeyboardEvent("keyup", {
    key: char,
    code: "Key" + char.toUpperCase(),
    keyCode,
    charCode: keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true
  })
  element.dispatchEvent(keyupEvent)
}

// Injection des identifiants dans la page ENT
function inject(login: string, password: string) {
  const loginInput =
    document.querySelector<HTMLInputElement>('input[type="text"]') ??
    (document.getElementById(":r5:") as HTMLInputElement | null)

  const passwordInput =
    document.querySelector<HTMLInputElement>('input[type="password"]') ??
    (document.getElementById(":r6:") as HTMLInputElement | null)

  const submitButton =
    document.querySelector<HTMLButtonElement>('button[type="submit"]') ??
    (document.getElementById(":r7:") as HTMLButtonElement | null)

  if (!loginInput || !passwordInput || !submitButton) {
    console.error("ENT auto-login: champs introuvables")
    return
  }

  // simulation frappe login
  for (let i = 0; i < login.length; i++) {
    sendCharacter(loginInput, login[i])
  }

  // simulation frappe mot de passe
  for (let i = 0; i < password.length; i++) {
    sendCharacter(passwordInput, password[i])
  }

  // soumission formulaire
  submitButton.click()
}

// Réception des identifiants envoyés par la page cliente (PeerJS)
window.addEventListener("message", (event: MessageEvent) => {
  if (!event.data) return

  // sécurité : on ne traite que les messages attendus
  if (event.data.type !== "ENT_AUTO_LOGIN") return

  // sécurité : on limite aux pages ENT
  if (!window.location.href.includes("/auth/login")) return

  const login = event.data.login as string | undefined
  const password = event.data.password as string | undefined

  if (!login || !password) {
    console.warn("ENT auto-login: données manquantes")
    return
  }

  inject(login, password)
})
