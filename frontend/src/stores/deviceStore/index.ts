import { create } from "zustand";
import { detectTouch } from "@/utils/common";

type DeviceState = {
  _isTouch: boolean | null;
  isTouch(): boolean;
};

const useDeviceStore = create<DeviceState>()((set, get) => ({
  _isTouch: null,

  isTouch: () => {
    if (get()._isTouch == null) {
      set(() => ({ _isTouch: detectTouch() }));
    }
    return get()._isTouch as boolean;
  },
}));

export default useDeviceStore;
