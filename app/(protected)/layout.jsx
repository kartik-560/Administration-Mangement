import LayoutWrapper from "@/components/layout/LayoutWrapper";
import AuthChecker from "@/components/layout/AuthChecker";

export default function ProtectedLayout({ children }) {
  return (
    <AuthChecker>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
    </AuthChecker>
  );
}