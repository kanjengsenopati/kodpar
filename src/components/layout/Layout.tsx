
import { ReactNode } from "react";
import LayoutSwitcher from "./LayoutSwitcher";
import "@/styles/form-styles.css";

type LayoutProps = {
  children: ReactNode;
  pageTitle: string;
  actions?: ReactNode;
};

/**
 * Main Layout component (Proxy for LayoutSwitcher)
 * This component acts as the central entry point for all page layouts,
 * automatically rendering either the Desktop or Mobile view.
 */
export default function Layout({ children, pageTitle, actions }: LayoutProps) {
  // Update document title centrally
  if (typeof document !== 'undefined') {
    document.title = `${pageTitle} | KOPIMU`;
  }
  
  return (
    <LayoutSwitcher pageTitle={pageTitle} actions={actions}>
      {children}
    </LayoutSwitcher>
  );
}
