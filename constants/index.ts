export const navigationLinks = [
  {
    href: "/library",
    label: "Library",
  },
  {
    img: "/icons/user.svg",
    selectedImg: "/icons/user-fill.svg",
    href: "/my-profile",
    label: "My Profile",
  },
];

export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Home",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/admin/users",
    text: "All Users",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/admin/books",
    text: "All Books",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/admin/borrow-records",
    text: "Borrow Records",
  },
  {
    img: "/icons/admin/user.svg",
    route: "/admin/account-requests",
    text: "Account Requests",
  },
];

export const FIELD_NAMES = {
  fullname: "Full name",
  email: "Email",
  universityId: "University ID Number",
  password: "Password",
  universityCard: "Upload University ID Card",
};

export const FIELD_TYPES = {
  fullname: "text",
  email: "email",
  universityId: "number",
  password: "password",
};

export const sampleBooks = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fantasy / Fiction",
    rating: 4.6,
    totalCopies: 20,
    availableCopies: 10,
    description:
      "A dazzling novel about all the choices that go into a life well lived, The Midnight Library tells the story of Nora Seed as she finds herself between life and death.",
    coverColor: "#1c1f40",
    coverUrl: "https://m.media-amazon.com/images/I/81J6APjwxlL.jpg",
    videoUrl: "https://ik.imagekit.io/jsmastery/sample-video.mp4",
    summary:
      "A dazzling novel about all the choices that go into a life well lived, The Midnight Library tells the story of Nora Seed as she finds herself between life and death.",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help / Productivity",
    rating: 4.9,
    totalCopies: 99,
    availableCopies: 50,
    description:
      "A revolutionary guide to making good habits, breaking bad ones, and getting 1% better every day.",
    coverColor: "#fffdf6",
    coverUrl: "https://m.media-amazon.com/images/I/81F90H7hnML.jpg",
    videoUrl: "https://ik.imagekit.io/jsmastery/sample-video.mp4",
    summary:
      "A revolutionary guide to making good habits, breaking bad ones, and getting 1% better every day.",
  },
  {
    id: 3,
    title: "You Don't Know JS: Scope & Closures",
    author: "Kyle Simpson",
    genre: "Computer Science / JavaScript",
    rating: 4.7,
    totalCopies: 9,
    availableCopies: 5,
    description:
      "An essential guide to understanding the core mechanisms of JavaScript, focusing on scope and closures.",
    coverColor: "#f8e036",
    coverUrl:
      "https://m.media-amazon.com/images/I/7186YfjgHHL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "https://ik.imagekit.io/jsmastery/sample-video.mp4",
    summary:
      "An essential guide to understanding the core mechanisms of JavaScript, focusing on scope and closures.",
  },
  {
    id: 4,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Philosophy / Adventure",
    rating: 4.5,
    totalCopies: 78,
    availableCopies: 50,
    description:
      "A magical tale of Santiago, an Andalusian shepherd boy, who embarks on a journey to find a worldly treasure.",
    coverColor: "#ed6322",
    coverUrl:
      "https://m.media-amazon.com/images/I/61HAE8zahLL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "https://ik.imagekit.io/jsmastery/sample-video.mp4",
    summary:
      "A magical tale of Santiago, an Andalusian shepherd boy, who embarks on a journey to find a worldly treasure.",
  },
  {
    id: 5,
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Self-Help / Productivity",
    rating: 4.7,
    totalCopies: 23,
    availableCopies: 23,
    description:
      "Rules for focused success in a distracted world, teaching how to cultivate deep focus to achieve peak productivity.",
    coverColor: "#ffffff",
    coverUrl: "https://m.media-amazon.com/images/I/81JJ7fyyKyS.jpg",
    videoUrl: "https://ik.imagekit.io/jsmastery/sample-video.mp4",
    summary:
      "Rules for focused success in a distracted world, teaching how to cultivate deep focus to achieve peak productivity.",
  },
  {
    id: 6,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Computer Science / Programming",
    rating: 4.8,
    totalCopies: 56,
    availableCopies: 10,
    description:
      "A handbook of agile software craftsmanship that teaches programmers how to write clean, maintainable code.",
    coverColor: "#080b13",
    coverUrl:
      "https://m.media-amazon.com/images/I/51E2055ZGUL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "https://ik.imagekit.io/jsmastery/sample-video.mp4",
    summary:
      "A handbook of agile software craftsmanship that teaches programmers how to write clean, maintainable code.",
  },
  {
    id: 7,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic / Fiction",
    rating: 4.1,
    totalCopies: 15,
    availableCopies: 3,
    description:
      "A novel set in the Jazz Age that explores themes of wealth, class, love, and the American Dream.",
    coverColor: "#1b4d3e",
    coverUrl:
      "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "https://ik.imagekit.io/jsmastery/sample-video.mp4",
    summary:
      "A novel set in the Jazz Age that explores themes of wealth, class, love, and the American Dream.",
  },
  {
    id: 8,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic / Fiction",
    rating: 4.8,
    totalCopies: 20,
    availableCopies: 7,
    description:
      "A powerful story of racial injustice and childhood innocence set in the American South during the 1930s.",
    coverColor: "#c7b07b",
    coverUrl:
      "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "https://ik.imagekit.io/jsmastery/sample-video.mp4",
    summary:
      "A powerful story of racial injustice and childhood innocence set in the American South during the 1930s.",
  },
];
