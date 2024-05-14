import SpinGradient from "../SpinGradient";

const FullSpinner = () => {
  return (
    <div className="centered-flex fixed inset-0 z-[100] h-screen bg-background">
      {/* <Spinner color="secondary" size="lg" /> */}
      <div className="flex-h-base items-center gap-4">
        <SpinGradient wrapperClass="w-24 text-secondary" />
        <p className="font-semibold tracking-widest text-foreground-700">
          WiniVibe
        </p>
      </div>
    </div>
  );
};

export default FullSpinner;
