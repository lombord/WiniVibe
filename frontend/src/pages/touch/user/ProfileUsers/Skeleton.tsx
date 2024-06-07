import { UserListSkeleton } from "@Touch/user/UsersList";

const Skeleton = ({ title }: { title: string }) => {
  return (
    <div>
      <h1 className="h4 my-2">{title}</h1>
      <UserListSkeleton count={25} />
    </div>
  );
};

export default Skeleton;
