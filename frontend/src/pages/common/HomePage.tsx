import { useSessionStore } from "@/stores/sessionStore";

const HomePage = () => {
  const user = useSessionStore.use.user();
  return (
    <div>
      <h1 className="mb-4 text-center">
        LoggedIn as: {user ? `${user.username}` : "Null"}
      </h1>
      <h1>Log in to Spotify h1</h1>
      <h2>Log in to Spotify h2</h2>
      <h3>Log in to Spotify h3</h3>
      <h4>Log in to Spotify h4</h4>
      <h5>Log in to Spotify h5</h5>
      <h6>Log in to Spotify h6</h6>

      <div
        className="[&>*:nth-child(4n+1)]:text-primary
      [&>*:nth-child(4n+2)]:text-success
      [&>*:nth-child(4n+3)]:text-secondary
      [&>*:nth-child(4n+4)]:text-danger
      "
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <h1 className="truncate" key={i}>Log in to Spotify brooooooooooo</h1>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
