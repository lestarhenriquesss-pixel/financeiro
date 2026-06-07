import {
    db
} from "./firebase.js"

import {
    auth
} from "./firebase.js"

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const Profile = {

    data: {
        name: "",
        email: ""
    },

    async load() {

        const user =
            auth.currentUser

        if (!user) return

        Profile.data.email =
            user.email

        const docRef =
            doc(
                db,
                "users",
                user.uid
            )

        const docSnap =
            await getDoc(docRef)

        if (docSnap.exists()) {

            const data =
                docSnap.data()

            Profile.data.name =
                data.name || ""

        }

        Profile.render()

    },

    async save() {

        const user =
            auth.currentUser

        if (!user) return

        const name =
            document.querySelector("#profile-name-input").value

        await setDoc(
            doc(
                db,
                "users",
                user.uid
            ),
            {
                name
            },
            {
                merge: true
            }
        )

        Profile.data.name =
            name

        Profile.render()

        ProfileModal.close()

        alert("Perfil atualizado!")

    },

    render() {

        const nameDisplay =
            document.querySelector("#profile-name-display")

        const emailDisplay =
            document.querySelector("#profile-email-display")

        const nameInput =
            document.querySelector("#profile-name-input")

        if (nameDisplay) {
            nameDisplay.innerHTML =
                Profile.data.name || "Usuário"
        }

        if (emailDisplay) {
            emailDisplay.innerHTML =
                Profile.data.email || ""
        }

        if (nameInput) {
            nameInput.value =
                Profile.data.name || ""
        }

        if (window.Groups) {
            Groups.render()
        }

    }

}

window.Profile = Profile

export {
    Profile
}