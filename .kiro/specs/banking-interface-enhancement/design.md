# Design Document

## Overview

This design document outlines the enhanced banking interface for the GreenBank mobile application, focusing on realistic banking functionality while maintaining the existing emerald green aesthetic. The design follows modern banking UX patterns and incorporates comprehensive financial management features.

## Design Principles

### Visual Consistency
- **Color Scheme**: Maintains the emerald green gradient theme (`from-emerald-700 to-emerald-900`)
- **Typography**: Uses consistent font hierarchy with proper contrast ratios
- **Spacing**: Follows 4px grid system with consistent padding and margins
- **Rounded Corners**: Uses `rounded-2xl` and `rounded-3xl` for cards and containers
- **Shadows**: Applies subtle shadows (`shadow-md`, `shadow-lg`) for depth

### Banking Authenticity
- **Account Numbers**: Properly masked format (****1234)
- **Currency Display**: Consistent formatting with proper decimal places
- **Transaction Categories**: Realistic merchant names and transaction types
- **Interest Rates**: Industry-standard APR and interest rate displays
- **Security Indicators**: Visual cues for account protection and security features

## Page Designs

### Accounts Page

#### Header Section
- **Gradient Background**: Emerald gradient matching home page aesthetic
- **Total Balance Card**: Prominent display with show/hide toggle
- **Quick Actions**: Four circular buttons with gradient styling and hover effects
- **Balance Visibility**: Eye icon toggle for privacy

#### Account Cards
- **Multiple Account Types**: Checking, Savings, Credit Cards, Investment accounts
- **Comprehensive Information**: 
  - Account name and masked number
  - Available balance and current balance
  - Interest rates and last statement dates
  - Status badges and overdraft protection indicators
- **Visual Hierarchy**: Color-coded icons for different account types
- **Interactive Elements**: Hover effects and navigation to detailed views

#### Recent Transactions
- **Transaction List**: Recent activity with merchant names and amounts
- **Category Icons**: Visual indicators for transaction types (deposit, transfer, purchase)
- **Date Formatting**: Consistent date display
- **Amount Formatting**: Proper currency formatting with positive/negative indicators

### Profile Page

#### Header Section
- **User Information**: Avatar, name, email, and customer tier
- **Member Status**: Premium badge with star icon
- **Account Tenure**: Member since date display

#### Personal Information
- **Contact Details**: Phone, email, and address with edit capabilities
- **Visual Icons**: Consistent iconography for different information types
- **Navigation Arrows**: Clear indication of editable fields

#### Security Settings
- **Comprehensive Options**: Two-factor authentication, biometric login, alerts
- **Status Indicators**: Visual confirmation of enabled/disabled features
- **Recommendations**: Badges highlighting recommended security features
- **Toggle Controls**: Easy-to-use switches for preference management

#### Notification Preferences
- **Granular Control**: Separate settings for different notification types
- **Clear Descriptions**: Explanatory text for each notification category
- **Instant Feedback**: Toast notifications for setting changes

#### Account Services
- **Banking Features**: Statements, tax documents, card management
- **Service Categories**: Organized grouping of related services
- **Action Indicators**: Clear navigation cues for each service

### Payments Page

#### Header Section
- **Service Overview**: Clear description of payment capabilities
- **Quick Actions Grid**: 2x2 grid of primary payment functions
- **Action Cards**: Descriptive cards with icons and explanations

#### Recent Payments
- **Transaction History**: Recent payment activity with recipients
- **Status Indicators**: Completed/pending badges
- **Payment Types**: Visual distinction between person-to-person, bills, and subscriptions
- **Amount Display**: Clear currency formatting

#### Scheduled Payments
- **Upcoming Payments**: List of scheduled recurring payments
- **Frequency Indicators**: Monthly/weekly payment schedules
- **Due Date Display**: Clear date formatting
- **Management Access**: Easy access to modify scheduled payments

#### Payment Services
- **Service Categories**: Digital payments, international, business services
- **Status Badges**: Active/setup/connected indicators
- **Service Descriptions**: Clear explanations of each service
- **Feature Availability**: Visual indication of available vs. coming soon features

#### Security Notice
- **Trust Building**: Prominent security assurance message
- **Visual Emphasis**: Emerald-themed security card
- **Shield Icon**: Security-focused iconography

## Component Specifications

### Cards
- **Border**: `border-0` for clean appearance
- **Shadow**: `shadow-md` for subtle depth
- **Background**: White with hover states
- **Padding**: Consistent `p-4` for content areas

### Buttons
- **Primary Actions**: Emerald gradient with white text
- **Secondary Actions**: Outline style with emerald borders
- **Icon Buttons**: Circular with appropriate sizing
- **Hover Effects**: Subtle scale and shadow changes

### Typography
- **Headers**: `text-2xl font-semibold` for page titles
- **Subheaders**: `text-lg font-semibold` for section titles
- **Body Text**: `text-sm` for regular content
- **Captions**: `text-xs text-muted-foreground` for secondary information

### Icons
- **Size Consistency**: `h-4 w-4` for inline icons, `h-5 w-5` for section headers
- **Color Coding**: Emerald for primary actions, muted for secondary
- **Contextual Usage**: Appropriate icons for financial concepts

### Badges
- **Status Indicators**: Default for active, outline for inactive
- **Color Coding**: Green for positive, red for negative, blue for neutral
- **Size**: Consistent `text-xs px-1.5 py-0.5` sizing

## Responsive Considerations

### Mobile-First Design
- **Touch Targets**: Minimum 44px for interactive elements
- **Thumb Navigation**: Bottom navigation for easy access
- **Scrollable Content**: Proper scroll areas for long lists
- **Safe Areas**: Appropriate padding for device bezels

### Content Hierarchy
- **Progressive Disclosure**: Most important information first
- **Scannable Layout**: Clear visual hierarchy for quick scanning
- **Grouped Information**: Related content grouped together
- **Action Accessibility**: Primary actions easily discoverable

## Accessibility Features

### Visual Accessibility
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Focus Indicators**: Clear focus states for keyboard navigation
- **Icon Labels**: Proper aria-labels for screen readers
- **Text Sizing**: Scalable text for vision accessibility

### Interaction Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Touch Accessibility**: Appropriate touch target sizes
- **Motion Sensitivity**: Respectful animation usage

## Implementation Notes

### State Management
- **Balance Visibility**: Local storage for user preference
- **Form States**: Proper loading and error states
- **Navigation States**: Active state indicators
- **Notification States**: Toast feedback for user actions

### Performance Considerations
- **Image Optimization**: Proper image sizing and formats
- **Animation Performance**: Hardware-accelerated animations
- **Bundle Optimization**: Code splitting for better loading
- **Caching Strategy**: Appropriate caching for static assets

### Security Implementation
- **Data Masking**: Proper masking of sensitive information
- **Input Validation**: Client-side validation with server verification
- **Session Management**: Secure session handling
- **Error Handling**: Secure error messages without information leakage