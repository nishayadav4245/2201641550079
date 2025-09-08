"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Container, AppBar, Toolbar, Typography, Tabs, Tab, Box } from "@mui/material"
import URLShortener from "../components/URLShortener"
import Statistics from "../components/Statistics"
import RedirectHandler from "../components/RedirectHandler"
import { Logger } from "../utils/logger"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function App() {
  const [tabValue, setTabValue] = useState(0)
  const [urlData, setUrlData] = useState([])
  const [clickStats, setClickStats] = useState([])

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedUrls = localStorage.getItem("affordmed-urls")
    const savedStats = localStorage.getItem("affordmed-stats")

    if (savedUrls) {
      setUrlData(JSON.parse(savedUrls))
    }
    if (savedStats) {
      setClickStats(JSON.parse(savedStats))
    }

    Logger.log("App initialized", { timestamp: new Date().toISOString() })
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    Logger.log("Tab changed", { tab: newValue === 0 ? "shortener" : "statistics" })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/:shortcode" element={<RedirectHandler urlData={urlData} setClickStats={setClickStats} />} />
          <Route
            path="/"
            element={
              <Container maxWidth="lg">
                <AppBar position="static" sx={{ mb: 4 }}>
                  <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      AffordMed URL Shortener
                    </Typography>
                  </Toolbar>
                </AppBar>

                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="main navigation">
                    <Tab label="URL Shortener" />
                    <Tab label="Statistics" />
                  </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                  <URLShortener urlData={urlData} setUrlData={setUrlData} />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Statistics clickStats={clickStats} urlData={urlData} />
                </TabPanel>
              </Container>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}
