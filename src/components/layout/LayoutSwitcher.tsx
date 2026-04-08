
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import DesktopLayout from "./DesktopLayout";
import MobileAppLayout from "./MobileAppLayout";

type LayoutSwitcherProps = {
  children: ReactNode;
  pageTitle: string;
};

/**
 * Component that automatically switches between Desktop and Mobile layouts
 * based on device detection.
 */
export default function LayoutSwitcher({ children, pageTitle }: LayoutSwitcherProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileAppLayout pageTitle={pageTitle}>{children}</MobileAppLayout>;
  }

  return <DesktopLayout pageTitle={pageTitle}>{children}</DesktopLayout>;
}
