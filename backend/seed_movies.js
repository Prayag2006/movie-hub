const movies = [
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
    releaseYear: 1972,
    rating: 9.2,
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
  },
  {
    title: "Fight Club",
    director: "David Fincher",
    releaseYear: 1999,
    rating: 8.8,
    description: "An insomniac office worker and a devil-may-care shoemaker form an underground fight club that evolves into something much, much more."
  },
  {
    title: "Forrest Gump",
    director: "Robert Zemeckis",
    releaseYear: 1994,
    rating: 8.8,
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75."
  },
  {
    title: "The Prestige",
    director: "Christopher Nolan",
    releaseYear: 2006,
    rating: 8.5,
    description: "After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other."
  },
  {
    title: "Gladiator",
    director: "Ridley Scott",
    releaseYear: 2000,
    rating: 8.5,
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery."
  }
];

async function seedMovies() {
  console.log("Seeding movies via API...");
  for (const movie of movies) {
    try {
      const response = await fetch('http://localhost:5000/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(movie)
      });
      
      if (response.ok) {
        console.log(`Successfully added: ${movie.title}`);
      } else {
        console.error(`Failed to add: ${movie.title}`);
      }
    } catch (error) {
      console.error(`Error connecting to API: ${error.message}. Is the backend running?`);
      break;
    }
  }
}

seedMovies();
