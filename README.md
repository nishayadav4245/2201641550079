#  URL Shortener - System Design Document

## 1. System Overview

### 1.1 Purpose
The  URL Shortener is a client-side web application that provides URL shortening services with comprehensive validation, security checks, and analytics tracking. The system allows users to create shortened URLs with custom shortcodes and expiration times while maintaining detailed usage statistics.

### 1.2 Key Features
- **URL Shortening**: Convert long URLs into short, manageable links
- **Custom Shortcodes**: Allow users to specify custom shortcodes (3-20 characters)
- **Expiration Management**: Set validity periods from 1 minute to 1 year
- **Security Validation**: Comprehensive URL validation and malicious content detection
- **Analytics Dashboard**: Real-time statistics and click tracking
- **Batch Processing**: Support for up to 5 URLs simultaneously
- **Client-Side Storage**: Local persistence using browser localStorage

## 2. Architecture Overview

### 2.1 System Architecture
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Client-Side Application                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   URL Shortener │  │   Statistics    │  │   Redirect   │ │
│  │   Component     │  │   Dashboard     │  │   Handler    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Validation    │  │   Security      │  │   Logger     │ │
│  │   Utils         │  │   Checker       │  │   Utils      │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Browser localStorage                      │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 2.2 Technology Stack
- **Frontend Framework**: React 18 with Next.js
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router DOM
- **State Management**: React useState/useEffect hooks
- **Data Persistence**: Browser localStorage
- **Validation**: Custom validation utilities
- **Security**: Client-side URL validation and pattern matching

## 3. Component Architecture

### 3.1 Core Components

#### 3.1.1 App Component (`app/page.js`)
- **Purpose**: Main application container and routing handler
- **Responsibilities**:
  - Application initialization and theme management
  - Tab navigation between URL Shortener and Statistics
  - Global state management for URL data and click statistics
  - localStorage integration for data persistence
  - Routing configuration for shortcode redirects

#### 3.1.2 URLShortener Component (`components/URLShortener.js`)
- **Purpose**: Primary interface for URL shortening operations
- **Responsibilities**:
  - Multi-URL entry form management (up to 5 URLs)
  - Real-time validation and error display
  - Shortcode generation and custom shortcode handling
  - Batch URL processing and result display
  - Clipboard integration for easy sharing

#### 3.1.3 Statistics Component (`components/Statistics.js`)
- **Purpose**: Analytics dashboard and reporting interface
- **Responsibilities**:
  - Summary metrics display (total URLs, clicks, active URLs)
  - URL performance table with click counts and status
  - Recent click activity tracking
  - Most popular URL identification
  - Expiration status monitoring

#### 3.1.4 RedirectHandler Component (`components/RedirectHandler.js`)
- **Purpose**: Handles shortcode resolution and redirection
- **Responsibilities**:
  - Shortcode lookup and validation
  - Expiration checking
  - Click event recording and analytics
  - User redirection with loading states
  - Error handling for invalid/expired URLs

### 3.2 Utility Modules

#### 3.2.1 Validation Utils (`utils/validation.js`)
- **URL Validation**:
  - Protocol validation (HTTP/HTTPS only)
  - Hostname and TLD verification
  - Private/localhost IP detection
  - Malicious domain checking
  - Suspicious pattern detection
  - URL length and format validation

- **Shortcode Validation**:
  - Length constraints (3-20 characters)
  - Character set validation (alphanumeric, hyphens, underscores)
  - Reserved word checking
  - Profanity filtering
  - Confusing character detection
  - Uniqueness verification

- **Validity Period Validation**:
  - Range checking (1 minute to 1 year)
  - Integer validation
  - Warning system for extreme values

#### 3.2.2 Security Checker (`components/URLSecurityChecker.js`)
- **Security Features**:
  - Real-time URL security analysis
  - Malicious pattern detection
  - Domain reputation checking
  - Suspicious TLD identification
  - Phishing attempt detection

#### 3.2.3 Logger Utils (`utils/logger.js`)
- **Logging Capabilities**:
  - Application event tracking
  - User interaction logging
  - Error and warning capture
  - Performance monitoring
  - Debug information collection

## 4. Data Models

### 4.1 URL Record Structure
\`\`\`javascript
{
  id: number,              // Unique identifier (timestamp + random)
  longUrl: string,         // Original URL (normalized)
  shortcode: string,       // Generated or custom shortcode
  expiryTime: string,      // ISO timestamp for expiration
  createdAt: string,       // ISO timestamp for creation
  clicks: number           // Click counter (legacy field)
}
\`\`\`

### 4.2 Click Statistics Structure
\`\`\`javascript
{
  shortcode: string,       // Associated shortcode
  timestamp: string,       // ISO timestamp of click
  referrer: string,        // Referrer URL or "Direct"
  location: string,        // Mock geolocation data
  userAgent: string        // Browser user agent string
}
\`\`\`

### 4.3 Validation Result Structure
\`\`\`javascript
{
  isValid: boolean,        // Overall validation status
  errors: object,          // Field-specific error messages
  warnings: object,        // Field-specific warnings
  normalizedUrl: string,   // Processed and normalized URL
  normalizedMinutes: number // Processed validity period
}
\`\`\`

## 5. Data Flow Architecture

### 5.1 URL Creation Flow
\`\`\`
User Input → Validation → Security Check → Shortcode Generation → 
Storage → Result Display → Clipboard Integration
\`\`\`

1. **Input Collection**: User enters URL, optional shortcode, and validity period
2. **Validation Pipeline**: Multi-layer validation including format, security, and business rules
3. **Shortcode Processing**: Generate random shortcode or validate custom shortcode
4. **Data Persistence**: Store URL record in localStorage with expiration metadata
5. **Result Presentation**: Display shortened URL with copy functionality

### 5.2 URL Resolution Flow
\`\`\`
Shortcode Request → Lookup → Expiration Check → Click Recording → 
Analytics Update → Redirection
\`\`\`

1. **Route Matching**: React Router captures shortcode from URL path
2. **Record Lookup**: Search localStorage for matching URL record
3. **Validation**: Check expiration status and record validity
4. **Analytics**: Record click event with metadata (timestamp, referrer, location)
5. **Redirection**: Navigate user to original URL with loading state

### 5.3 Analytics Flow
\`\`\`
Click Events → Data Aggregation → Metric Calculation → 
Dashboard Display → Real-time Updates
\`\`\`

1. **Event Capture**: Record each click with comprehensive metadata
2. **Data Processing**: Aggregate clicks by shortcode and time periods
3. **Metric Generation**: Calculate totals, trends, and performance indicators
4. **Visualization**: Present data through tables, cards, and status indicators

## 6. Security Architecture

### 6.1 URL Security Validation
- **Protocol Enforcement**: Only HTTP/HTTPS protocols allowed
- **Private Network Protection**: Block localhost and private IP ranges
- **Malicious Domain Detection**: Maintain blocklist of known malicious domains
- **Pattern Analysis**: Detect suspicious URL patterns and encoding
- **TLD Validation**: Verify legitimate top-level domains
- **Subdomain Analysis**: Prevent excessive subdomain abuse

### 6.2 Shortcode Security
- **Character Restrictions**: Alphanumeric characters with limited special characters
- **Reserved Word Protection**: Block system and common reserved terms
- **Profanity Filtering**: Prevent inappropriate shortcode content
- **Collision Prevention**: Ensure uniqueness across all generated codes
- **Length Constraints**: Enforce minimum and maximum length limits

### 6.3 Client-Side Security Measures
- **Input Sanitization**: Comprehensive validation before processing
- **XSS Prevention**: Proper escaping and validation of user inputs
- **Data Validation**: Multi-layer validation with error handling
- **Secure Storage**: Proper localStorage usage with data validation

## 7. Performance Considerations

### 7.1 Client-Side Optimization
- **Lazy Loading**: Components loaded on demand
- **Efficient Rendering**: Optimized React component updates
- **Memory Management**: Proper cleanup of event listeners and timers
- **Batch Processing**: Handle multiple URLs efficiently

### 7.2 Storage Optimization
- **Data Compression**: Efficient data structures for localStorage
- **Cleanup Strategies**: Remove expired URLs automatically
- **Size Monitoring**: Track and manage localStorage usage
- **Fallback Handling**: Graceful degradation when storage is unavailable

### 7.3 User Experience Optimization
- **Loading States**: Clear feedback during processing
- **Error Handling**: Comprehensive error messages and recovery options
- **Responsive Design**: Mobile-first responsive interface
- **Accessibility**: ARIA labels and keyboard navigation support

## 8. Scalability Considerations

### 8.1 Current Limitations
- **Client-Side Storage**: Limited by browser localStorage capacity (~5-10MB)
- **No Server Persistence**: Data lost when localStorage is cleared
- **Single User**: No multi-user support or sharing capabilities
- **Limited Analytics**: Basic click tracking without advanced metrics

### 8.2 Future Scalability Options
- **Backend Integration**: Add server-side storage and API endpoints
- **Database Migration**: Move from localStorage to persistent database
- **User Authentication**: Add user accounts and URL ownership
- **Advanced Analytics**: Implement detailed tracking and reporting
- **CDN Integration**: Improve global performance and reliability

## 9. Error Handling Strategy

### 9.1 Validation Errors
- **Real-time Feedback**: Immediate validation with clear error messages
- **Field-Level Errors**: Specific error indication for each input field
- **Batch Validation**: Handle multiple URL validation efficiently
- **Recovery Guidance**: Provide actionable error resolution steps

### 9.2 Runtime Errors
- **Graceful Degradation**: Maintain functionality when features fail
- **Error Boundaries**: Prevent application crashes from component errors
- **Fallback States**: Alternative UI when primary features unavailable
- **User Notification**: Clear communication of error states and solutions

### 9.3 Data Integrity
- **Validation Layers**: Multiple validation checkpoints
- **Data Sanitization**: Clean and normalize all user inputs
- **Consistency Checks**: Verify data integrity across operations
- **Backup Strategies**: Protect against data loss scenarios

## 10. Monitoring and Analytics

### 10.1 Application Metrics
- **Usage Statistics**: Track URL creation and click patterns
- **Performance Monitoring**: Monitor component render times and user interactions
- **Error Tracking**: Log and analyze application errors and failures
- **User Behavior**: Analyze user interaction patterns and preferences

### 10.2 Business Metrics
- **Conversion Rates**: Track successful URL shortening operations
- **User Engagement**: Monitor session duration and feature usage
- **Popular Features**: Identify most-used functionality
- **Error Rates**: Track validation failures and user errors

## 11. Deployment Architecture

### 11.1 Current Deployment
- **Static Hosting**: Client-side application suitable for static hosting
- **CDN Distribution**: Can be deployed via content delivery networks
- **Browser Compatibility**: Modern browser support with fallbacks
- **Mobile Responsiveness**: Optimized for mobile and desktop devices

### 11.2 Infrastructure Requirements
- **Minimal Server Requirements**: Static file serving only
- **No Database Dependencies**: Self-contained client-side storage
- **No Backend Services**: Fully functional without server-side components
- **Cross-Platform Support**: Works across all modern web browsers

## 12. Future Enhancements

### 12.1 Planned Features
- **QR Code Generation**: Generate QR codes for shortened URLs
- **Bulk Import/Export**: CSV import/export functionality
- **Advanced Analytics**: Detailed click analytics and reporting
- **Custom Domains**: Support for custom domain shortening
- **API Integration**: RESTful API for programmatic access

### 12.2 Technical Improvements
- **Progressive Web App**: Add PWA capabilities for offline usage
- **Real-time Sync**: Implement real-time data synchronization
- **Advanced Security**: Enhanced security scanning and validation
- **Performance Optimization**: Further optimize loading and rendering
- **Accessibility Enhancement**: Improve accessibility compliance

This system design document provides a comprehensive overview of the AffordMed URL Shortener architecture, covering all major components, data flows, security measures, and future considerations for scalability and enhancement.


