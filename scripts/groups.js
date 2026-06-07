import {
    db,
    auth
} from "./firebase.js"

import {
    doc,
    setDoc,
    getDoc,
    addDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const Groups = {

    activeGroup: null,

    async createPublicProfile() {

        const user =
            auth.currentUser

        if (!user) return

        await setDoc(
            doc(
                db,
                "publicProfiles",
                user.uid
            ),
            {
                uid: user.uid,
                email: user.email,
                name: Profile.data.name || "Usuário"
            },
            {
                merge: true
            }
        )

    },

    async createGroup() {

        const user =
            auth.currentUser

        if (!user) return

        const email =
            document
                .querySelector("#group-user-email")
                .value
                .trim()
                .toLowerCase()

        const groupName =
            document
                .querySelector("#group-name-input")
                .value
                .trim() || "Grupo de contas"

        if (!email) {
            alert("Informe o e-mail do integrante.")
            return
        }

        await Groups.createPublicProfile()

        const profilesRef =
            collection(db, "publicProfiles")

        const q =
            query(
                profilesRef,
                where("email", "==", email)
            )

        const snapshot =
            await getDocs(q)

        if (snapshot.empty) {
            alert("Usuário não encontrado. Ele precisa acessar o app pelo menos uma vez.")
            return
        }

        const invitedUser =
            snapshot.docs[0].data()

        const groupRef =
            await addDoc(
                collection(db, "groups"),
                {
                    name: groupName,
                    ownerId: user.uid,
                    members: [
                        user.uid,
                        invitedUser.uid
                    ],
                    memberEmails: [
                        user.email,
                        invitedUser.email
                    ],
                    createdAt: new Date().toISOString()
                }
            )

        localStorage.setItem(
            "controle.financeiro:activeGroupId",
            groupRef.id
        )

        localStorage.setItem(
            "controle.financeiro:lastGroupId",
            groupRef.id
        )

        await Groups.loadGroup(groupRef.id)

        document.querySelector("#group-user-email").value = ""

        GroupModal.close()

        alert("Grupo criado com sucesso!")

    },

    async loadGroup(groupId) {

        try {

            const groupRef =
                doc(
                    db,
                    "groups",
                    groupId
                )

            const groupSnap =
                await getDoc(groupRef)

            if (!groupSnap.exists()) {

                Groups.clearGroupStorage()

                Groups.activeGroup = null

                Groups.render()

                return

            }

            const groupData =
                groupSnap.data()

            const user =
                auth.currentUser

            if (
                !user ||
                !groupData.members ||
                !groupData.members.includes(user.uid)
            ) {

                Groups.clearGroupStorage()

                Groups.activeGroup = null

                Groups.render()

                return

            }

            Groups.activeGroup = {
                id: groupSnap.id,
                ...groupData
            }

            localStorage.setItem(
                "controle.financeiro:activeGroupId",
                groupSnap.id
            )

            Groups.render()

            await Transaction.load()

            await OpeningBalance.load()

            App.render()

        } catch(error) {

            console.error("Erro ao carregar grupo:", error)

            Groups.clearGroupStorage()

            Groups.activeGroup = null

            Groups.render()

        }

    },

    async loadActiveGroup() {

        const groupId =
            localStorage.getItem(
                "controle.financeiro:activeGroupId"
            )

        if (!groupId) {

            Groups.activeGroup = null

            Groups.render()

            return

        }

        await Groups.loadGroup(groupId)

    },

    async toggleMode() {

        if (Groups.activeGroup) {

            Groups.exitGroupVisualOnly()

            return

        }

        const lastGroupId =
            localStorage.getItem(
                "controle.financeiro:lastGroupId"
            )

        if (lastGroupId) {

            await Groups.loadGroup(lastGroupId)

            return

        }

        GroupModal.open()

    },

    exitGroupVisualOnly() {

        if (Groups.activeGroup) {

            localStorage.setItem(
                "controle.financeiro:lastGroupId",
                Groups.activeGroup.id
            )

        }

        Groups.activeGroup = null

        localStorage.removeItem(
            "controle.financeiro:activeGroupId"
        )

        Groups.render()

        Transaction.load().then(() => {

            OpeningBalance.load().then(() => {

                App.render()

            })

        })

    },

    async exitGroup() {

        const user =
            auth.currentUser

        if (!user || !Groups.activeGroup) {
            alert("Nenhum grupo ativo.")
            return
        }

        const confirmExit =
            confirm("Tem certeza que deseja deixar este grupo?")

        if (!confirmExit) return

        try {

            const groupId =
                Groups.activeGroup.id

            const groupRef =
                doc(
                    db,
                    "groups",
                    groupId
                )

            const groupSnap =
                await getDoc(groupRef)

            if (!groupSnap.exists()) {

                Groups.clearGroupStorage()

                Groups.activeGroup = null

                Groups.render()

                GroupModal.close()

                return

            }

            const groupData =
                groupSnap.data()

            const currentMembers =
                groupData.members || []

            const currentEmails =
                groupData.memberEmails || []

            const updatedMembers =
                currentMembers.filter(member => {
                    return member !== user.uid
                })

            const updatedEmails =
                currentEmails.filter(email => {
                    return email !== user.email
                })

            if (updatedMembers.length === 0) {

                await deleteDoc(groupRef)

            } else {

                await updateDoc(
                    groupRef,
                    {
                        members: updatedMembers,
                        memberEmails: updatedEmails
                    }
                )

            }

            Groups.clearGroupStorage()

            Groups.activeGroup = null

            Groups.render()

            await Transaction.load()

            await OpeningBalance.load()

            App.render()

            GroupModal.close()

            alert("Você deixou o grupo.")

        } catch(error) {

            console.error("Erro real ao deixar grupo:", error)

            alert("Não foi possível deixar o grupo. Veja o console.")

        }

    },

    clearGroupStorage() {

        localStorage.removeItem(
            "controle.financeiro:activeGroupId"
        )

        localStorage.removeItem(
            "controle.financeiro:lastGroupId"
        )

    },

    async saveGroupName() {

        if (!Groups.activeGroup) {
            alert("Você precisa estar em um grupo.")
            return
        }

        const name =
            document
                .querySelector("#group-name-input")
                .value
                .trim()

        if (!name) {
            alert("Informe um nome para o grupo.")
            return
        }

        await updateDoc(
            doc(
                db,
                "groups",
                Groups.activeGroup.id
            ),
            {
                name
            }
        )

        Groups.activeGroup.name =
            name

        Groups.render()

        GroupModal.close()

        alert("Nome do grupo atualizado!")

    },

    fillGroupForm() {

        const nameInput =
            document.querySelector("#group-name-input")

        const membersList =
            document.querySelector("#group-members-list")

        if (nameInput) {

            nameInput.value =
                Groups.activeGroup
                    ? Groups.activeGroup.name || ""
                    : ""

        }

        if (membersList) {

            if (!Groups.activeGroup) {

                membersList.innerHTML =
                    "Nenhum grupo ativo"

            } else {

                membersList.innerHTML =
                    Groups.activeGroup.memberEmails.join("<br>")

            }

        }

    },

    getMemberCount() {

        if (!Groups.activeGroup) return 1

        return Groups.activeGroup.members.length || 1

    },

    render() {

        const nameDisplay =
            document.querySelector("#profile-name-display")

        const emailDisplay =
            document.querySelector("#profile-email-display")

        const modeDisplay =
            document.querySelector("#active-mode-display")

        const toggleButton =
            document.querySelector("#toggle-group-mode-button")

        const membersList =
            document.querySelector("#group-members-list")

        if (
            !nameDisplay ||
            !emailDisplay ||
            !modeDisplay ||
            !toggleButton
        ) return

        if (!Groups.activeGroup) {

            nameDisplay.innerHTML =
                Profile.data.name || "Usuário"

            emailDisplay.innerHTML =
                Profile.data.email || ""

            modeDisplay.innerHTML =
                "Modo individual"

            toggleButton.innerHTML =
                "Usar grupo"

            if (membersList) {
                membersList.innerHTML =
                    "Nenhum grupo ativo"
            }

            return

        }

        nameDisplay.innerHTML =
            Groups.activeGroup.name || "Grupo"

        emailDisplay.innerHTML =
            Groups.activeGroup.memberEmails.join(" • ")

        modeDisplay.innerHTML =
            `${Groups.getMemberCount()} integrantes`

        toggleButton.innerHTML =
            "Modo individual"

        if (membersList) {
            membersList.innerHTML =
                Groups.activeGroup.memberEmails.join("<br>")
        }

    }

}

window.Groups = Groups

export {
    Groups
}