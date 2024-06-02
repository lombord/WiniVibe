import DynamicGrid from "@Base/Layout/DynamicGrid";

const PlaylistsPage = () => {
  return (
    <div>
      <h1 className="text-center text-primary">PlaylistsPage</h1>
      <DynamicGrid minCol="200px" minRow="200px" rowCount={1}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i}>{i}</div>
        ))}
      </DynamicGrid>
    </div>
  );
};

export default PlaylistsPage;
