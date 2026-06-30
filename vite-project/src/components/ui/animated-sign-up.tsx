import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import SignUpCard from "./signup-1";

interface AnimatedSignUpProps {
  onSignUpSuccess?: () => void;
}

const AnimatedSignUp: React.FC<AnimatedSignUpProps> = ({ onSignUpSuccess }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark-mode");
  };

  useEffect(() => {
    document.documentElement.classList.add("dark-mode");
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("particles-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; color: string;
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = `rgba(57, 255, 20, ${Math.random() * 0.15})`;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      animFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animFrameId);
    };
  }, [isDarkMode]);

  return (
    <div
      className={`login-container ${isDarkMode ? "dark" : "light"}`}
      style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      {/* Animated particles canvas */}
      <canvas id="particles-canvas" className="particles-canvas" />

      {/* Theme toggle */}
      <button className="theme-toggle" onClick={toggleDarkMode} aria-label="Toggle theme">
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Sign Up card — rendered over the animated background */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px 16px', animation: 'cardReveal 0.7s cubic-bezier(0.16,1,0.3,1) both' }}>
        <SignUpCard onSignUpSuccess={onSignUpSuccess} />
      </div>
    </div>
  );
};

export default AnimatedSignUp;
