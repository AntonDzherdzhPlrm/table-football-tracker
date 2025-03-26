import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { TeamMatches } from "./pages/TeamMatches";
import { IndividualMatches } from "./pages/IndividualMatches";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
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

  // Only show header on individual and team pages
  const showHeader =
    location.pathname === "/individual" || location.pathname === "/team";

  return (
    <div className="min-h-screen flex flex-col bg-football">
      {showHeader && <Header />}

      {/* Routes */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/individual" element={<IndividualMatches />} />
          <Route path="/team" element={<TeamMatches />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
