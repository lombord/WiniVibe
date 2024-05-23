import { useSessionStore } from "@/stores/sessionStore";
import { Avatar, Button, Switch } from "@nextui-org/react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import {
  Profile,
  Notification,
  Moon,
  IconProps,
  LogoutCurve,
  LoginCurve,
} from "iconsax-react";

import styles from "./style.module.css";
import { useThemeCtx } from "@/hooks/contexts";

const Topbar = () => {
  const user = useSessionStore.use.user();
  const { theme, toggleTheme } = useThemeCtx();
  const iconClasses = "pointer-events-none text-current flex-shrink-0 text-xl";
  const iconProps: IconProps = {
    size: "1em",
    className: iconClasses,
    variant: "Bold",
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <span className="h3">Good Evening</span>
      </div>

      <div className={styles.topbarRight}>
        <Button isIconOnly radius="full" variant="flat">
          <Notification size="1.5em" variant="Bold" />
        </Button>
        <Dropdown closeOnSelect={false} placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly radius="full">
              <Avatar
                showFallback
                className="cursor-pointer transition-transform"
                fallback={<Profile size="1.5em" variant="Bold" />}
                src={user?.profile?.photo?.small}
              />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="faded"
            aria-label="User menu"
            onAction={(key) => {
              if (key == "theme") toggleTheme();
            }}
          >
            <DropdownSection aria-label="base actions" showDivider>
              {
                (user && (
                  <DropdownItem
                    hidden={!user}
                    key="profile"
                    startContent={<Profile {...iconProps} />}
                  >
                    Profile
                  </DropdownItem>
                )) as JSX.Element
              }
              <DropdownItem
                key="theme"
                startContent={<Moon {...iconProps} />}
                endContent={
                  <Switch
                    aria-label="Switch theme"
                    isSelected={theme == "dark"}
                    classNames={{ wrapper: "mr-0" }}
                    size="sm"
                    color="primary"
                  />
                }
              >
                Dark Mode
              </DropdownItem>
            </DropdownSection>
            {user ? (
              <DropdownItem
                startContent={<LogoutCurve {...iconProps} />}
                href="/logout"
                key="logout"
              >
                Logout
              </DropdownItem>
            ) : (
              <DropdownItem
                startContent={<LoginCurve {...iconProps} />}
                href="/auth"
                key="login"
              >
                Login
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Topbar;
