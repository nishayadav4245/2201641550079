"use client"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Alert,
} from "@mui/material"
import { BarChart, Timeline, Language } from "@mui/icons-material"

export default function Statistics({ clickStats, urlData }) {
  const getClicksForUrl = (shortcode) => {
    return clickStats.filter((stat) => stat.shortcode === shortcode)
  }

  const getTotalClicks = () => {
    return clickStats.length
  }

  const getMostClickedUrl = () => {
    const clickCounts = {}
    clickStats.forEach((stat) => {
      clickCounts[stat.shortcode] = (clickCounts[stat.shortcode] || 0) + 1
    })

    const mostClicked = Object.entries(clickCounts).reduce(
      (a, b) => (clickCounts[a[0]] > clickCounts[b[0]] ? a : b),
      ["", 0],
    )

    return mostClicked[0] ? { shortcode: mostClicked[0], clicks: mostClicked[1] } : null
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const isExpired = (expiryTime) => {
    return new Date() > new Date(expiryTime)
  }

  if (urlData.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Statistics
        </Typography>
        <Alert severity="info">
          No URLs have been shortened yet. Go to the URL Shortener tab to create some links!
        </Alert>
      </Box>
    )
  }

  const mostClicked = getMostClickedUrl()

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Statistics Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <BarChart sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4" color="primary">
                {urlData.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total URLs Created
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Timeline sx={{ fontSize: 40, color: "secondary.main", mb: 1 }} />
              <Typography variant="h4" color="secondary">
                {getTotalClicks()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Clicks
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Language sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {urlData.filter((url) => !isExpired(url.expiryTime)).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active URLs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {mostClicked && (
        <Alert severity="success" sx={{ mb: 3 }}>
          🏆 Most clicked URL: /{mostClicked.shortcode} with {mostClicked.clicks} clicks
        </Alert>
      )}

      {/* URL Statistics Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            URL Performance
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Clicks</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urlData.map((url) => {
                  const clicks = getClicksForUrl(url.shortcode)
                  const expired = isExpired(url.expiryTime)

                  return (
                    <TableRow key={url.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                          /{url.shortcode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={url.longUrl}
                        >
                          {url.longUrl}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={clicks.length} size="small" color={clicks.length > 0 ? "primary" : "default"} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatTimestamp(url.createdAt)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={expired ? "Expired" : "Active"}
                          size="small"
                          color={expired ? "error" : "success"}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Click Details */}
      {clickStats.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Clicks
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Short URL</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Referrer</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clickStats
                    .slice(-10)
                    .reverse()
                    .map((stat, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                            /{stat.shortcode}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{formatTimestamp(stat.timestamp)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{stat.referrer || "Direct"}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{stat.location}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
