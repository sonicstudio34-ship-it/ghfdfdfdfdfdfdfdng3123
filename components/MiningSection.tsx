"use client"

import { useState, useEffect } from "react"
import type { User } from "@/types"
import { gameLogic } from "@/lib/game-logic"
import { Play, Gift } from "lucide-react"

interface MiningSectionProps {
  user: User
  onStartMining: () => any
  onClaimRewards: () => any
  onOpenRank: () => void
}

export const MiningSection = ({ user, onStartMining, onClaimRewards, onOpenRank }: MiningSectionProps) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const [canClaim, setCanClaim] = useState(false)
  const [currentRewards, setCurrentRewards] = useState(0)

  // Update timer and rewards
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (user.isMining) {
      interval = setInterval(() => {
        const duration = gameLogic.getMiningDuration(user)
        const minTime = user.minClaimTime || 300 // 5 minutes default
        
        if (duration >= minTime) {
          setCanClaim(true)
          setTimeLeft(0)
          // Calculate current rewards based on mining time
          const rewards = gameLogic.calculatePendingRewards(user)
          setCurrentRewards(rewards)
        } else {
          setCanClaim(false)
          setTimeLeft(minTime - duration)
          // Show accumulating rewards
          const rewards = gameLogic.calculatePendingRewards(user)
          setCurrentRewards(rewards)
        }
      }, 1000)
    } else {
      setCanClaim(false)
      setTimeLeft(0)
      setCurrentRewards(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [user.isMining, user.miningStartTime, user.minClaimTime])

  const handleStartMining = () => {
    const result = onStartMining()
  }

  const handleClaimRewards = () => {
    const result = onClaimRewards()
    setCurrentRewards(0) // Reset rewards after claiming
  }

  const formatTime = (seconds: number) => {
    return gameLogic.formatTime(seconds)
  }

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-spin {
          animation: spin 60s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .gradient-bg {
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
        }
        .gradient-claim {
          background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%);
        }
        .gradient-bg:hover {
          background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%);
        }
        .gradient-claim:hover {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "transparent",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Mining Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "8px",
            minHeight: "100vh",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              marginBottom: "16px",
              width: "100%",
              maxWidth: "288px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1",
                maxWidth: "220px",
                margin: "0 auto",
              }}
            >
              {/* Decorative frame */}
              <img
                style={{
                  position: "absolute",
                  top: "0",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
                src="https://i.ibb.co/JFGDschD/frame-DVb9-S8gn.webp"
                alt="Decorative frame"
              />

              <img
                className={user.isMining ? "animate-spin" : ""}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                src="https://i.ibb.co/5hm0vS7x/fan-B68di-VBr.webp"
                alt="Mining fan"
              />

              {/* Overlay logo */}
              <img
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "20%",
                  height: "auto",
                  zIndex: 20,
                }}
                src="https://i.ibb.co/whrjJxzQ/download-2.png"
                alt="Overlay logo"
              />
            </div>

            {/* Current mining rewards display */}
            {user.isMining && currentRewards > 0 && (
              <div 
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  zIndex: 30,
                }}
                className="animate-pulse"
              >
                +{gameLogic.formatNumberPrecise(currentRewards)} DRX
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: "0",
              marginBottom: "16px",
              marginTop: "40px",
            }}
          >
            <p
              style={{
                fontSize: "24px",
                fontWeight: "900",
                textAlign: "center",
                fontFamily: "monospace",
              }}
            >
              <span>{gameLogic.formatNumber(currentRewards)}</span> DRX
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
                style={{
                  opacity: 0.6,
                  width: "12px",
                  height: "12px",
                }}
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"></path>
              </svg>
              <p style={{ fontWeight: "bold" }}>{gameLogic.formatNumberPrecise(user.miningRate || 0.001)}/s ⚡️️</p>
              {user.isMining && timeLeft > 0 && (
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "14px",
                    color: "#06b6d4",
                    fontWeight: "bold",
                  }}
                >
                  {formatTime(timeLeft)}
                </span>
              )}
              {user.isMining && canClaim && (
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "14px",
                    color: "#10b981",
                    fontWeight: "bold",
                  }}
                  className="animate-pulse"
                >
                  Ready!
                </span>
              )}
            </div>
          </div>

          {!user.isMining ? (
            <button
              onClick={handleStartMining}
              className="gradient-bg"
              style={{
                width: "100%",
                maxWidth: "288px",
                padding: "12px",
                borderRadius: "16px",
                fontWeight: "bold",
                fontSize: "16px",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Play style={{ width: "16px", height: "16px" }} />
              Start Mine
            </button>
          ) : (
            <button
              onClick={handleClaimRewards}
              disabled={!canClaim}
              className={canClaim ? "gradient-claim animate-pulse" : ""}
              style={{
                width: "100%",
                maxWidth: "288px",
                padding: "12px",
                borderRadius: "16px",
                fontWeight: "bold",
                fontSize: "16px",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "#ffffff",
                border: "none",
                cursor: canClaim ? "pointer" : "not-allowed",
                background: canClaim 
                  ? "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)"
                  : "#374151",
                opacity: canClaim ? 1 : 0.6,
              }}
            >
              <Gift style={{ width: "16px", height: "16px" }} />
              {canClaim ? "Claim" : `Wait ${formatTime(timeLeft)}`}
            </button>
          )}

          {/* Banner Section */}
          <div
            style={{
              marginTop: "24px",
              width: "100%",
              maxWidth: "288px",
            }}
          >
            <img
              style={{
                borderRadius: "12px",
                width: "100%",
              }}
              src="https://mining-master.onrender.com//assets/banner-BH8QO14f.png"
              alt="banner"
            />
          </div>
        </div>
      </div>
    </>
  )
}