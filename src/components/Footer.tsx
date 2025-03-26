import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function Footer() {
  const BouncingBall = () => (
    <motion.div
      className="fixed bottom-4 right-4 w-8 h-8 bg-white rounded-full shadow-lg"
      animate={{
        y: [0, -20],
        rotate: [0, 360],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  );

  return (
    <footer className="bg-gray-900/90 backdrop-blur-sm text-white mt-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <p className="mb-4 md:mb-0">
            © 2025 Table Football Tracker. Created by Dzherdzh Anton. All rights
            reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy-policy"
              className="text-gray-300 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="text-gray-300 hover:text-white">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
      <BouncingBall />
    </footer>
  );
}
