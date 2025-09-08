"use client"

import { useState } from "react"
import { Box, Card, CardContent, TextField, Button, Typography, Grid, Alert, IconButton, Tooltip } from "@mui/material"
import { Add as AddIcon, Delete as DeleteIcon, Link as LinkIcon } from "@mui/icons-material"
import { generateShortcode, validateUrlEntry } from "../utils/validation"
import { Logger } from "../utils/logger"
import URLSecurityChecker from "./URLSecurityChecker"
import ValidationSummary from "./ValidationSummary"

export default function URLShortener({ urlData, setUrlData }) {
  const [urlEntries, setUrlEntries] = useState([
    { id: 1, longUrl: "", shortcode: "", validityMinutes: 30, error: "", result: null },
  ])

  const addUrlEntry = () => {
    if (urlEntries.length < 5) {
      const newEntry = {
        id: Date.now(),
        longUrl: "",
        shortcode: "",
        validityMinutes: 30,
        error: "",
        result: null,
      }
      setUrlEntries([...urlEntries, newEntry])
      Logger.log("URL entry added", { totalEntries: urlEntries.length + 1 })
    }
  }

  const removeUrlEntry = (id) => {
    if (urlEntries.length > 1) {
      setUrlEntries(urlEntries.filter((entry) => entry.id !== id))
      Logger.log("URL entry removed", { totalEntries: urlEntries.length - 1 })
    }
  }

  const updateUrlEntry = (id, field, value) => {
    setUrlEntries(
      urlEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value, error: "", result: null } : entry)),
    )
  }

  const validateEntry = (entry) => {
    const existingShortcodes = urlData.map((url) => url.shortcode)
    const validation = validateUrlEntry(entry, existingShortcodes)

    return validation
  }

  const shortenUrls = () => {
    const updatedEntries = urlEntries.map((entry) => {
      const validation = validateEntry(entry)

      if (!validation.isValid) {
        return {
          ...entry,
          errors: validation.errors,
          warnings: validation.warnings,
          result: null,
        }
      }

      const shortcode = entry.shortcode?.trim() || generateShortcode()
      const validityMinutes = validation.normalizedMinutes || 30
      const expiryTime = new Date(Date.now() + validityMinutes * 60000)

      const urlRecord = {
        id: Date.now() + Math.random(),
        longUrl: validation.normalizedUrl,
        shortcode,
        expiryTime: expiryTime.toISOString(),
        createdAt: new Date().toISOString(),
        clicks: 0,
      }

      const result = {
        shortUrl: `${window.location.origin}/${shortcode}`,
        expiryTime: expiryTime.toLocaleString(),
      }

      // Update global URL data
      const newUrlData = [...urlData, urlRecord]
      setUrlData(newUrlData)
      localStorage.setItem("affordmed-urls", JSON.stringify(newUrlData))

      Logger.log("URL shortened", {
        shortcode,
        longUrl: validation.normalizedUrl,
        expiryTime: expiryTime.toISOString(),
      })

      return {
        ...entry,
        errors: {},
        warnings: validation.warnings,
        result,
      }
    })

    setUrlEntries(updatedEntries)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      Logger.log("URL copied to clipboard", { url: text })
    })
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Shorten Your URLs
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Enter up to 5 URLs to shorten. Each shortened URL will be valid for the specified duration.
      </Typography>

      <ValidationSummary />
      <URLSecurityChecker />

      {urlEntries.map((entry, index) => (
        <Card key={entry.id} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">URL #{index + 1}</Typography>
              {urlEntries.length > 1 && (
                <IconButton onClick={() => removeUrlEntry(entry.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Long URL *"
                  placeholder="https://example.com/very-long-url"
                  value={entry.longUrl}
                  onChange={(e) => updateUrlEntry(entry.id, "longUrl", e.target.value)}
                  error={!!entry.error && entry.error.includes("URL")}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Custom Shortcode (optional)"
                  placeholder="mylink"
                  value={entry.shortcode}
                  onChange={(e) => updateUrlEntry(entry.id, "shortcode", e.target.value)}
                  error={!!entry.error && entry.error.includes("shortcode")}
                  helperText="3-10 alphanumeric characters"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Validity (minutes)"
                  value={entry.validityMinutes}
                  onChange={(e) => updateUrlEntry(entry.id, "validityMinutes", Number.parseInt(e.target.value) || "")}
                  error={!!entry.error && entry.error.includes("Validity")}
                  helperText="Default: 30 minutes"
                />
              </Grid>
            </Grid>

            {(entry.errors?.longUrl || entry.errors?.shortcode || entry.errors?.validityMinutes) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {entry.errors.longUrl && <div>{entry.errors.longUrl}</div>}
                {entry.errors.shortcode && <div>{entry.errors.shortcode}</div>}
                {entry.errors.validityMinutes && <div>{entry.errors.validityMinutes}</div>}
              </Alert>
            )}

            {entry.warnings?.validityMinutes && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {entry.warnings.validityMinutes}
              </Alert>
            )}

            {entry.result && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "success.light", borderRadius: 1 }}>
                <Typography variant="subtitle2" color="success.dark" gutterBottom>
                  ✅ URL Shortened Successfully!
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <LinkIcon fontSize="small" />
                  <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                    {entry.result.shortUrl}
                  </Typography>
                  <Tooltip title="Copy to clipboard">
                    <IconButton size="small" onClick={() => copyToClipboard(entry.result.shortUrl)}>
                      📋
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Expires: {entry.result.expiryTime}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      <Box display="flex" gap={2} mb={3}>
        {urlEntries.length < 5 && (
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addUrlEntry}>
            Add Another URL
          </Button>
        )}

        <Button variant="contained" onClick={shortenUrls} disabled={urlEntries.every((entry) => !entry.longUrl.trim())}>
          Shorten URLs
        </Button>
      </Box>

      {urlEntries.length === 5 && <Alert severity="info">Maximum of 5 URLs can be shortened at once.</Alert>}
    </Box>
  )
}
