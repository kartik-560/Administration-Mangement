import ThemeProvider from "../features/theme/ThemeProvider";
// Import the StoreProvider we created in Step 1
import StoreProvider from "../components/layout/StoreProvider"; // Adjust this path based on where you saved it
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Wrap your app with the Redux StoreProvider */}
        <StoreProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}