import PostItem from "../components/PostItem";

const Explore = () => {
  // Тимчасові вигадані пости
  const posts = [
    {
      id: "1",
      title: "Breaking Bad",
      description: "Дізнайтесь слова які необхідно знати кожному, щоб кофмортно дивитись культовий серіал!",
      author: { id: "101", username: "john_doe" },
      tags: [
        { id: "201", name: "HBO" },
        { id: "202", name: "Show" }
      ]
    },
    {
      id: "2",
      title: "Baldur's Gate 3",
      description: "Вивчить всі особливості світу D&D перш ніж поринути у захоплючу пригоду до брами Балдура!",
      author: { id: "102", username: "jane_smith" },
      tags: [
        { id: "204", name: "D&D" },
        { id: "203", name: "Larian Studios" },
        { id: "204", name: "Videogames" }
      ]
    },
    {
      id: "3",
      title: "Adventure Time",
      description: "Покращуйте свої знання англійської дивлячись улюблені мультики дитинства!",
      author: { id: "103", username: "dev_guru" },
      tags: [
        { id: "205", name: "Cartoon" }
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Explore Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Explore;
