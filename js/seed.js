// liste des amis (hard coded)

const friendsData = [
    { id: 1, name: "John Pork", status: "online", mutual: 12, picture: "assets/img1.png" },
    { id: 2, name: "Quandale Dingle", status: "offline", mutual: 8, picture: "assets/img2.png" },
    { id: 3, name: "Sophie Martin", status: "online", mutual: 15, picture: "assets/img3.png" },
    { id: 4, name: "Lucas Bernard", status: "idle", mutual: 5, picture: "assets/img4.png" },
    { id: 5, name: "Emma Rodriguez", status: "online", mutual: 20, picture: "assets/img5.png" }
];



const conversationsData = [
    {
        id: 1,
        friendId: 1, // Foreign key
        name: "John Pork",
        status: "En ligne",
        lastMessage: "Salut!",
        lastMessageTime: "10:45",
        picture: "/api/placeholder/50/50",
        messages: [
            { text: "Salut!", time: "10:00", senderId: 1 }, 
            { text: "Comment ça va ?", time: "10:02", senderId: 3 }, 
        ],
    },
    {
        id: 2,
        friendId: 2,  
        name: "Quandale Dingle",
        status: "Hors ligne",
        lastMessage: "À bientôt",
        lastMessageTime: "Hier",
        picture: "/api/placeholder/50/50",
        messages: [
            { text: "Bonjour Bob", time: "09:30", senderId: 2 },  
            { text: "À bientôt", time: "09:45", senderId: 2 }, 
        ],
    },
    {
        id: 3,
        friendId: 3,  
        name: "Sophie Martin",
        status: "En ligne",
        lastMessage: "À bientôt!",
        lastMessageTime: "Aujourd'hui",
        picture: "/api/placeholder/50/50",
        messages: [
            { text: "Salut!", time: "10:00", senderId: 3 }, 
            { text: "Comment ça va ?", time: "10:02", senderId: 4 }, 
        ],
    },
];


// liste des messages d'une conversation
const messagesData = [
    { id: 1, conversationId: 1, text: "Salut!", time: "10:30 AM", senderId: 1 }, 
    { id: 2, conversationId: 1, text: "Bonjour, comment ça va ?", time: "10:32 AM", senderId: 3 }, 
    { id: 3, conversationId: 2, text: "Bonjour, Quandale!", time: "10:33 AM", senderId: 1 }, 
    { id: 4, conversationId: 2, text: "À bientôt!", time: "10:34 AM", senderId: 2 }, 
];

const postsData = [
    {
        id: 1,
        text: "Ceci est mon premier post !",
        author: "John Pork",
        time: new Date().toLocaleTimeString(),
        media: "assets/post1.png", 
        comments: [],
        like: 0,
        liked: false,
        dislike: 0,
        disliked: false,
        heart: 0,
        hearted: false 
    },
    {
        id: 2,
        text: "Quel beau jour aujourd'hui !",
        author: "Sophie Martin",
        time: new Date().toLocaleTimeString(),
        media: "assets/post2.png",
        comments: [],

        like: 0,
        liked: false,
        dislike: 0,
        disliked: false,
        heart: 0,
        hearted: false
    },
    {
        id: 3,
        text: "Avez-vous vu le dernier film ?",
        author: "Emma Rodriguez",
        time: new Date().toLocaleTimeString(),
        media: "",
        comments: [],

        like: 0,
        liked: false,
        dislike: 0,
        disliked: false,
        heart: 0,
        hearted: false
    },
    {
        id: 4,
        text: "Prêt pour le week-end !",
        author: "Lucas Bernard",
        time: new Date().toLocaleTimeString(),
        media: "assets/post3.png",
        comments: [],

        like: 0,
        liked: false,
        dislike: 0,
        disliked: false,
        heart: 0,
        hearted: false
    },
];

// fonction de seed, pour remplir le localstorage
function seedData() {
    // l'opération de seed doit etre fait une fois que l'application est dépolyé, et pas à chaque modification
    if (!localStorage.getItem("seedScriptRun")) {

        // liste des amis
        localStorage.setItem('friends', JSON.stringify(friendsData));

        // listes des conversations 
        localStorage.setItem('conversations', JSON.stringify(conversationsData));

        // liste des messages
        localStorage.setItem('messages', JSON.stringify(messagesData));

        // liste des postes
        localStorage.setItem('posts', JSON.stringify(postsData)); 

        // cette variable indique c'est le seed est fait
        localStorage.setItem("seedScriptRun", "true");
        console.log("Data crée.");
    } else {
        console.log("Data éxiste dèja.");
    }
}

seedData();
