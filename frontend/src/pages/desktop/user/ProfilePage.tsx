import { useFetchProfile } from "@/hooks/fetch";

export const Component = () => {
  const { isPending, error, data: user } = useFetchProfile();

  if (isPending) return <h2>Loading</h2>;
  if (error) return <h2>Error</h2>;

  return (
    <div>
      <h2 className="capitalize text-primary">{user.username}</h2>
      <h3 className="text-secondary">Desktop</h3>
    </div>
  );
};

export default Component;
