import * as React from "react"
import { cn } from "@/lib/utils"
import { CLASS_COLORS, hexToRgba } from "@/lib/colors"

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
  gap?: number
  speed?: number
  colors?: string[]
}

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ 
    className, 
    size = 30, 
    gap = 5, 
    speed = 1.2, 
    colors = CLASS_COLORS.map(color => color.hex),
    ...props 
  }, ref) => {
    const containerStyle = {
      width: `${5 * size + 4 * gap}px`,
    }

    const dotStyle = {
      height: `${size}px`,
      width: `${size}px`,
    }

    return (
      <>
        <style>{`
          .progress {
            display: flex;
            gap: ${gap}px;
            align-items: center;
            justify-content: center;
            text-align: center;
            backface-visibility: hidden;
          }

          .inner {
            border-radius: 3px;
            animation: progress ${speed}s ease-in infinite;
          }

          .inner:nth-child(1) {
            animation-delay: 0.15s;
          }

          .inner:nth-child(2) {
            animation-delay: 0.25s;
          }

          .inner:nth-child(3) {
            animation-delay: 0.35s;
          }

          .inner:nth-child(4) {
            animation-delay: 0.45s;
          }

          .inner:nth-child(5) {
            animation-delay: 0.55s;
          }

          @keyframes progress {
            0% {
              transform: translateY(0px);
              opacity: 1;
            }
            50% {
              transform: translateY(-30px);
              opacity: 0.8;
            }
            100% {
              transform: translateY(0px);
              opacity: 1;
            }
          }
        `}</style>
        <div className="flex flex-col items-center justify-center">
        <div
          ref={ref}
          data-slot="loader"
          className={cn("progress", className)}
          style={containerStyle}
          {...props}
        >
          <div 
            className="inner"
            style={{ 
              ...dotStyle,
              backgroundColor: hexToRgba(colors[0] || CLASS_COLORS[0].hex, 0.2),
              border: `2px solid ${colors[0] || CLASS_COLORS[0].hex}`
            }}
          />
          <div 
            className="inner"
            style={{ 
              ...dotStyle,
              backgroundColor: hexToRgba(colors[1] || CLASS_COLORS[1].hex, 0.2),
              border: `2px solid ${colors[1] || CLASS_COLORS[1].hex}`
            }}
          />
          <div 
            className="inner"
            style={{ 
              ...dotStyle,
              backgroundColor: hexToRgba(colors[2] || CLASS_COLORS[2].hex, 0.2),
              border: `2px solid ${colors[2] || CLASS_COLORS[2].hex}`
            }}
          />
          <div 
            className="inner"
            style={{ 
              ...dotStyle,
              backgroundColor: hexToRgba(colors[3] || CLASS_COLORS[3].hex, 0.2),
              border: `2px solid ${colors[3] || CLASS_COLORS[3].hex}`
            }}
          />
          <div 
            className="inner"
            style={{ 
              ...dotStyle,
              backgroundColor: hexToRgba(colors[4] || CLASS_COLORS[4].hex, 0.2),
              border: `2px solid ${colors[4] || CLASS_COLORS[4].hex}`
            }}
          />
        </div>
        <div className="text-xl text-black font-bold pt-2">Loading...</div>
        </div>
      </>
    )
  }
)

Loader.displayName = "Loader"