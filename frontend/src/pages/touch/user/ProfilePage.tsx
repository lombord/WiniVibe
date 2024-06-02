import HeaderImage from "@/components/common/User/HeaderImage";
import { useFetchProfile } from "@/hooks/fetch";

export const Component = () => {
  const { isPending, error, data: user } = useFetchProfile();

  if (isPending) return <h2>Loading</h2>;
  if (error) return <h2>Error</h2>;

  return (
    <div>
      <HeaderImage src={user.profile.header_image.medium} />
    </div>
  );
};

export default Component;
