"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Box, Typography, CircularProgress, Alert } from "@mui/material"
import { Logger } from "../utils/logger"

export default function RedirectHandler({ urlData, setClickStats }) {
  const { shortcode } = useParams()
  const [redirecting, setRedirecting] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleRedirect = () => {
      Logger.log("Redirect attempt", { shortcode })

      // Find the URL record
      const urlRecord = urlData.find((url) => url.shortcode === shortcode)

      if (!urlRecord) {
        setError("Short URL not found")
        setRedirecting(false)
        Logger.log("Redirect failed - URL not found", { shortcode })
        return
      }

      // Check if URL has expired
      const now = new Date()
      const expiryTime = new Date(urlRecord.expiryTime)

      if (now > expiryTime) {
        setError("This short URL has expired")
        setRedirecting(false)
        Logger.log("Redirect failed - URL expired", { shortcode, expiryTime: urlRecord.expiryTime })
        return
      }

      // Record the click
      const clickRecord = {
        shortcode,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || "Direct",
        location: getMockLocation(), // Mock geolocation data
        userAgent: navigator.userAgent,
      }

      // Update click statistics
      setClickStats((prevStats) => {
        const newStats = [...prevStats, clickRecord]
        localStorage.setItem("affordmed-stats", JSON.stringify(newStats))
        return newStats
      })

      Logger.log("Click recorded", clickRecord)

      // Redirect to the long URL
      setTimeout(() => {
        window.location.href = urlRecord.longUrl
      }, 1000)
    }

    if (urlData.length > 0) {
      handleRedirect()
    }
  }, [shortcode, urlData, setClickStats])

  const getMockLocation = () => {
    const locations = [
      "New York, NY, USA",
      "Los Angeles, CA, USA",
      "Chicago, IL, USA",
      "Houston, TX, USA",
      "Phoenix, AZ, USA",
      "Philadelphia, PA, USA",
      "San Antonio, TX, USA",
      "San Diego, CA, USA",
      "Dallas, TX, USA",
      "San Jose, CA, USA",
    ]
    return locations[Math.floor(Math.random() * locations.length)]
  }

  if (urlData.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">{error}</Typography>
        </Alert>
        <Typography variant="body1" color="text.secondary">
          The short URL "/{shortcode}" {error.includes("expired") ? "has expired" : "could not be found"}.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            ← Go back to AffordMed URL Shortener
          </a>
        </Typography>
      </Box>
    )
  }

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Redirecting...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        You will be redirected to your destination shortly.
      </Typography>
    </Box>
  )
}
