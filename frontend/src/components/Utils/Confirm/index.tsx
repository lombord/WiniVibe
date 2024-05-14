import { type PromiseCB, animateCB } from "@/utils/request";
import { Button } from "@nextui-org/react";
import { FC, useState } from "react";

interface ConfirmProps {
  title?: string;
  acceptTitle?: string;
  rejectTitle?: string;
  acceptCB?: PromiseCB;
  rejectCB?: PromiseCB;
}

const Confirm: FC<ConfirmProps> = ({
  title = "Confirm",
  acceptTitle = "Accept",
  rejectTitle = "reject",
  acceptCB,
  rejectCB,
}) => {
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  return (
    <div className="max-w-full px-4">
      <h1 className="text-center text-secondary">{title}</h1>
      <div className="mt-8 flex justify-center gap-4">
        <Button
          isLoading={accepting}
          onPress={() => animateCB(acceptCB, setAccepting)}
          size="lg"
          color="primary"
        >
          {acceptTitle}
        </Button>
        <Button
          isLoading={rejecting}
          onPress={() => animateCB(rejectCB, setRejecting)}
          size="lg"
          color="default"
        >
          {rejectTitle}
        </Button>
      </div>
    </div>
  );
};

export default Confirm;
