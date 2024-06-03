export const Component = () => {
  return (
    <div>
      {Array.from({ length: 50 }).map((_, i) => (
        <h2 key={i}>ProfilePage</h2>
      ))}
    </div>
  );
};

export default Component;
