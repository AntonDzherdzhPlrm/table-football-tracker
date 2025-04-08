import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { TeamMatches } from "./pages/TeamMatches";
import { IndividualMatches } from "./pages/IndividualMatches";
import { PlayerManagementPage } from "./pages/PlayerManagement";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Rules } from "./pages/Rules";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfUse } from "./pages/TermsOfUse";
import { DialogProvider } from "./lib/DialogContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LocalizationProvider } from "./lib/LocalizationContext";
import "./App.css";
import { CorsTest } from "./pages/CorsTest";

// Main App container with context
function App() {
  return (
    <LocalizationProvider>
      <BrowserRouter>
        <DialogProvider>
          <AppContent />
        </DialogProvider>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

// App content with access to context
function AppContent() {
  const location = useLocation();

  // Show header on individual, team, rules, privacy policy, and terms of use pages
  const showHeader =
    location.pathname === "/individual" ||
    location.pathname === "/team" ||
    location.pathname === "/management" ||
    location.pathname === "/rules" ||
    location.pathname === "/privacy-policy" ||
    location.pathname === "/terms-of-use";

  // Determine background class based on path
  const getBackgroundClass = () => {
    if (location.pathname === "/") return "bg-main-football";
    if (location.pathname === "/team") return "bg-team-football";
    if (location.pathname === "/individual") return "bg-individual-football";
    if (location.pathname === "/rules") return "bg-rules-football";
    if (location.pathname === "/management") return "bg-management-football";
    return "bg-football";
  };

  // Define inline style to ensure the background is visible
  const backgroundStyle = {
    backgroundImage:
      location.pathname === "/management"
        ? "url('https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2076&auto=format&fit=crop')"
        : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${getBackgroundClass()}`}
      style={{
        ...(location.pathname === "/management" ? backgroundStyle : {}),
        position: "relative",
        overflow: "hidden",
      }}
    >
      {showHeader && <Header />}

      {/* Routes */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/individual" element={<IndividualMatches />} />
          <Route path="/team" element={<TeamMatches />} />
          <Route path="/management" element={<PlayerManagementPage />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/cors-test" element={<CorsTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
