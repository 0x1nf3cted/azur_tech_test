// liste des amis (hard coded)

const friendsData = [
    { id: 1, name: "John Pork", status: "online", mutual: 12, picture: "assets/img1.png" },
    { id: 2, name: "Quandale Dingle", status: "offline", mutual: 8, picture: "assets/img2.png" },
    { id: 3, name: "Sophie Martin", status: "online", mutual: 15, picture: "assets/img3.png" },
    { id: 4, name: "Lucas Bernard", status: "idle", mutual: 5, picture: "assets/img4.png" },
    { id: 5, name: "Emma Rodriguez", status: "online", mutual: 20, picture: "assets/img5.png" }
];


// fonction de seed, pour remplir le localstorage
function seedData() {
    // l'opération de seed doit etre fait une fois que l'application est dépolyé, et pas à chaque modification
    if (!localStorage.getItem("seedScriptRun")) {
        localStorage.setItem('friends', JSON.stringify(friendsData));

        // cette variable indique c'est le seed est fait
        localStorage.setItem("seedScriptRun", "true");
        console.log("Data crée.");
    } else {
        console.log("Data éxiste dèja.");
    }
}

seedData();
