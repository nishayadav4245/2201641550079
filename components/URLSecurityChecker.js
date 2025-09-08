"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { Security as SecurityIcon, CheckCircle as CheckIcon, Info as InfoIcon } from "@mui/icons-material"
import { validateUrl } from "../utils/validation"

export default function URLSecurityChecker({ onUrlValidated }) {
  const [url, setUrl] = useState("")
  const [validationResult, setValidationResult] = useState(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkUrl = async () => {
    if (!url.trim()) return

    setIsChecking(true)

    // Simulate security check delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const result = validateUrl(url)
    setValidationResult(result)
    setIsChecking(false)

    if (onUrlValidated) {
      onUrlValidated(result)
    }
  }

  const getSecurityScore = (result) => {
    if (!result.isValid) return 0

    let score = 70 // Base score for valid URL

    // Add points for HTTPS
    if (result.normalizedUrl?.startsWith("https://")) score += 20

    // Add points for common TLDs
    if (result.normalizedUrl?.match(/\.(com|org|edu|gov)$/)) score += 10

    return Math.min(score, 100)
  }

  const getSecurityLevel = (score) => {
    if (score >= 90) return { level: "High", color: "success" }
    if (score >= 70) return { level: "Medium", color: "warning" }
    if (score >= 50) return { level: "Low", color: "error" }
    return { level: "Very Low", color: "error" }
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <SecurityIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6">URL Security Checker</Typography>
        </Box>

        <Box display="flex" gap={2} mb={2}>
          <TextField
            fullWidth
            label="Enter URL to check"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
          <Button variant="contained" onClick={checkUrl} disabled={!url.trim() || isChecking} sx={{ minWidth: 120 }}>
            {isChecking ? "Checking..." : "Check URL"}
          </Button>
        </Box>

        {validationResult && (
          <Box>
            {validationResult.isValid ? (
              <Box>
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">✅ URL is valid and safe to shorten</Typography>
                </Alert>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Typography variant="body2">Security Score:</Typography>
                  <Chip
                    label={`${getSecurityScore(validationResult)}/100`}
                    color={getSecurityLevel(getSecurityScore(validationResult)).color}
                    size="small"
                  />
                  <Chip
                    label={getSecurityLevel(getSecurityScore(validationResult)).level}
                    color={getSecurityLevel(getSecurityScore(validationResult)).color}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Valid URL format" />
                  </ListItem>

                  {validationResult.normalizedUrl?.startsWith("https://") && (
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Uses secure HTTPS protocol" />
                    </ListItem>
                  )}

                  <ListItem>
                    <ListItemIcon>
                      <CheckIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="No malicious patterns detected" />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <InfoIcon color="info" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Normalized URL" secondary={validationResult.normalizedUrl} />
                  </ListItem>
                </List>
              </Box>
            ) : (
              <Alert severity="error">
                <Typography variant="subtitle2">❌ URL validation failed</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {validationResult.error}
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
