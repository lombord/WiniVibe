import CardsSkeleton from "@/components/common/User/UserCards/CardsSkeleton";

const Skeleton = ({ title }: { title: string }) => {
  return (
    <div>
      <h2 className="h3 mb-4 text-center text-white">{title}</h2>
      <CardsSkeleton count={25} />
    </div>
  );
};

export default Skeleton;
