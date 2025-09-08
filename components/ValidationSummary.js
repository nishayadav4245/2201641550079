"use client"

import { Box, Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material"
import { CheckCircle as CheckIcon, Cancel as CancelIcon, Info as InfoIcon } from "@mui/icons-material"

export default function ValidationSummary() {
  return (
    <Card sx={{ mb: 3, bgcolor: "grey.50" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          📋 URL Validation Guidelines
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          Our enhanced validation system checks for the following:
        </Typography>

        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
          <Box flex={1}>
            <Typography variant="subtitle2" color="success.main" gutterBottom>
              ✅ What We Accept
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="HTTP/HTTPS URLs" secondary="Secure protocols only" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Valid domains" secondary="Proper TLD and format" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Custom shortcodes" secondary="3-20 alphanumeric characters" />
              </ListItem>
            </List>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

          <Box flex={1}>
            <Typography variant="subtitle2" color="error.main" gutterBottom>
              ❌ What We Block
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CancelIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Private/localhost URLs" secondary="Security restriction" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CancelIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Suspicious patterns" secondary="Malware/phishing protection" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CancelIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Reserved shortcodes" secondary="System and inappropriate words" />
              </ListItem>
            </List>
          </Box>
        </Box>

        <Box mt={2} p={2} bgcolor="info.light" borderRadius={1}>
          <Box display="flex" alignItems="center" mb={1}>
            <InfoIcon color="info" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2" color="info.dark">
              Pro Tips
            </Typography>
          </Box>
          <Typography variant="body2" color="info.dark">
            • URLs are automatically normalized (protocol added if missing) • Shortcodes avoid confusing characters (0,
            O, 1, l, I) • Validity periods have reasonable limits (1 minute to 1 year) • All validation happens
            instantly on the client-side
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
