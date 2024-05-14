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
      <p>
        Ad voluptate occaecat culpa commodo eu. Consequat est sit do mollit id
        anim nulla Lorem incididunt consectetur adipisicing cillum esse. Sint
        voluptate nulla occaecat veniam laboris. Ex officia ex anim anim labore
        tempor nulla. Veniam ut sunt reprehenderit velit duis nostrud esse
        cupidatat nulla commodo ut. Ipsum adipisicing exercitation ipsum
        incididunt eu velit et non cupidatat.
      </p>
    </div>
  );
};

export default HomePage;
