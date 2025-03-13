import { useState, useEffect, useCallback, memo } from "react";

interface GlitchCursorProps {
  isHovering: boolean;
}

const GlitchCursor: React.FC<GlitchCursorProps> = ({ isHovering }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isGlitching, setIsGlitching] = useState(false);

  // Memoize the event handler to prevent unnecessary re-creation
  const updatePosition = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Only add/remove event listener when component mounts/unmounts
  useEffect(() => {
    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, [updatePosition]);

  // Handle glitching effect with cleanup
  useEffect(() => {
    let glitchInterval: NodeJS.Timeout | null = null;

    if (isHovering) {
      glitchInterval = setInterval(() => {
        setIsGlitching(true);
        const timeout = setTimeout(() => setIsGlitching(false), 100);

        // Return a cleanup function for the setTimeout
        return () => clearTimeout(timeout);
      }, 2000);
    }

    // Clean up interval when component unmounts or isHovering changes
    return () => {
      if (glitchInterval) clearInterval(glitchInterval);
    };
  }, [isHovering]);

  // Don't render the component if it's not visible
  if (!isHovering && !isGlitching) {
    return null;
  }

  return (
    <div
      className={`fixed pointer-events-none z-50 mix-blend-difference ${
        isHovering ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        willChange: "left, top", // Hint to browser for optimization
      }}
    >
      <div className={`relative ${isGlitching ? "animate-glitch" : ""}`}>
        <div className="w-12 h-12 rounded-full border-2 border-white" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-white -translate-x-1/2 -translate-y-1/2 rotate-45" />
        <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-white -translate-x-1/2 -translate-y-1/2 -rotate-45" />
      </div>
    </div>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default memo(GlitchCursor);
