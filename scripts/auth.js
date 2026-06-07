import {
    auth
} from "./firebase.js"

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

const Auth = {

    async register(email, password) {

        try {

            const user =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                )

            console.log("Usuário criado:", user)

            alert("Conta criada com sucesso!")

        } catch (error) {

            console.error(error)

            alert(error.message)

        }

    },

    async login(email, password) {

        try {

            const user =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                )

            console.log("Logado:", user)

            alert("Login realizado!")

        } catch (error) {

            console.error(error)

            alert(error.message)

        }

    },

    async logout() {

        await signOut(auth)

        alert("Logout realizado!")

    }

}