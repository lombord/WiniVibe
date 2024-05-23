import SpinGradient from "../SpinGradient";
import { rootTeleport } from "@/utils/react";

const VPSpinner = () => {
  return rootTeleport(
    <div className="centered-flex fixed inset-0 z-[100] h-screen bg-background">
      {/* <Spinner color="secondary" size="lg" /> */}
      <div className="flex-v-base items-center gap-4">
        <SpinGradient wrapperClass="w-24 text-secondary" />
        <p className="font-semibold tracking-widest text-foreground-700">
          WiniVibe
        </p>
      </div>
    </div>,
    "spinner:VPSpinner",
  );
};

export default VPSpinner;
