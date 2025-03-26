import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { TeamMatches } from "./pages/TeamMatches";
import { IndividualMatches } from "./pages/IndividualMatches";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Rules } from "./pages/Rules";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfUse } from "./pages/TermsOfUse";
import { DialogProvider } from "./lib/DialogContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Main App container with context
function App() {
  return (
    <BrowserRouter>
      <DialogProvider>
        <AppContent />
      </DialogProvider>
    </BrowserRouter>
  );
}

// App content with access to context
function AppContent() {
  const location = useLocation();

  // Show header on individual, team, rules, privacy policy, and terms of use pages
  const showHeader =
    location.pathname === "/individual" ||
    location.pathname === "/team" ||
    location.pathname === "/rules" ||
    location.pathname === "/privacy-policy" ||
    location.pathname === "/terms-of-use";

  return (
    <div className="min-h-screen flex flex-col bg-football">
      {showHeader && <Header />}

      {/* Routes */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/individual" element={<IndividualMatches />} />
          <Route path="/team" element={<TeamMatches />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
