
import { ReactNode } from "react";
import LayoutSwitcher from "./LayoutSwitcher";
import "@/styles/form-styles.css";

type LayoutProps = {
  children: ReactNode;
  pageTitle: string;
};

/**
 * Main Layout component (Proxy for LayoutSwitcher)
 * This component acts as the central entry point for all page layouts,
 * automatically rendering either the Desktop or Mobile view.
 */
export default function Layout({ children, pageTitle }: LayoutProps) {
  // Update document title centrally
  if (typeof document !== 'undefined') {
    document.title = `${pageTitle} | Koperasi-ERP`;
  }
  
  return (
    <LayoutSwitcher pageTitle={pageTitle}>
      {children}
    </LayoutSwitcher>
  );
}
