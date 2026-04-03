import LayoutWrapper from "@/components/layout/LayoutWrapper";
// import AuthChecker from "@/components/AuthChecker";

export default function ProtectedLayout({ children }) {
  return (
    // <AuthChecker>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
    // </AuthChecker>
  );
}