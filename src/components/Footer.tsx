import { motion } from "framer-motion";

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
        <div className="text-center">
          <p>
            © 2025 Table Football Tracker. Created by Dzherdzh Anton. All rights
            reserved.
          </p>
        </div>
      </div>
      <BouncingBall />
    </footer>
  );
}
