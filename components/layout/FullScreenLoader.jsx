import { useEffect } from "react";

function FullScreenLoader({ isLoading, message = "Loading" }) {
  useEffect(() => {
    if (isLoading) {
      document.body.classList.add("loading-active");
    } else {
      document.body.classList.remove("loading-active");
    }

    return () => {
      document.body.classList.remove("loading-active");
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-900 animate-fade-in">
      <div className="flex flex-col items-center gap-8">
        {/* Creative orbital loader */}
        <div className="relative h-32 w-32">
          {/* Center core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="h-4 w-4 bg-primarygreen-500 animate-pulse-scale"
              style={{
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              }}
            />
          </div>

          {/* Trace rings that pulse out */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border border-primarygreen-500/30 animate-ring-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="h-24 w-24 rounded-full border border-primarygreen-300/20 animate-ring-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </div>

        {/* Loading text with streetwear vibe */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-neutral-50 text-lg font-bold tracking-wider uppercase">
            {message}
          </p>
          <div className="flex gap-1.5">
            <div
              className="h-1 w-1 rounded-full bg-primarygreen-500 animate-bounce"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="h-1 w-1 rounded-full bg-primarygreen-500 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="h-1 w-1 rounded-full bg-primarygreen-500 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbit-1 {
          from {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(40px) rotate(-360deg);
          }
        }

        @keyframes orbit-2 {
          from {
            transform: rotate(90deg) translateX(48px) rotate(-90deg);
          }
          to {
            transform: rotate(450deg) translateX(48px) rotate(-450deg);
          }
        }

        @keyframes orbit-3 {
          from {
            transform: rotate(180deg) translateX(56px) rotate(-180deg);
          }
          to {
            transform: rotate(540deg) translateX(56px) rotate(-540deg);
          }
        }

        @keyframes orbit-4 {
          from {
            transform: rotate(270deg) translateX(64px) rotate(-270deg);
          }
          to {
            transform: rotate(630deg) translateX(64px) rotate(-630deg);
          }
        }

        @keyframes pulse-scale {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }

        @keyframes ring-pulse {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-orbit-1 {
          animation: orbit-1 2s linear infinite;
        }

        .animate-orbit-2 {
          animation: orbit-2 2.5s linear infinite;
        }

        .animate-orbit-3 {
          animation: orbit-3 3s linear infinite;
        }

        .animate-orbit-4 {
          animation: orbit-4 3.5s linear infinite;
        }

        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        .animate-ring-pulse {
          animation: ring-pulse 2s ease-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default FullScreenLoader;
