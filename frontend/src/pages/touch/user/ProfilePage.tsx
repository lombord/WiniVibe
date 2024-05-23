import { useFetchProfile } from "@/hooks/fetch";

export const Component = () => {
  const { isPending, error, data: user } = useFetchProfile();

  if (isPending) return <h2>Loading</h2>;
  if (error) return <h2>Error</h2>;

  return (
    <div>
      <h2 className="text-center text-primary">{user.username}</h2>
      <h3 className="text-center text-secondary">Mobile</h3>
    </div>
  );
};

export default Component;
