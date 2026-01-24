# HealthKit User Journey - Figma Integration

## Overview

Three screens from Figma have been integrated into the Apple HealthKit user journey to provide a guided, user-friendly onboarding experience.

## User Flow

### 1. Entry Points
Users can start the HealthKit connection from:
- **Health Screen** → Tap "Connect Apple Health" button (on Physical/Emotional/Mental/Energy tabs)
- **Data Screen** → Tap "Apple" device card

### 2. Screen 1: Connect Apple Health (Intro)
**File:** `app/connect-apple-health.tsx`

**Purpose:** Introduces users to Apple Health integration and explains benefits

**Features:**
- Large health icon/illustration
- Clear title and description
- Benefits list with checkmarks:
  - Automatic data sync from iPhone
  - Comprehensive health tracking
  - Personalized insights
  - Secure data handling
- Privacy note explaining data security
- "Connect Apple Health" button → Navigates to permissions screen
- "Skip for now" option → Returns to previous screen

**Navigation:**
- Back button → Returns to previous screen
- Connect button → `/apple-health-permissions`
- Skip button → Returns to previous screen

### 3. Screen 2: Apple Health Permissions
**File:** `app/apple-health-permissions.tsx`

**Purpose:** Allows users to select which health data types to share

**Features:**
- Scrollable list of 12 health data types:
  - Steps (Physical)
  - Heart Rate (Emotional)
  - Active Energy (Physical)
  - Sleep (Mental)
  - Distance (Physical)
  - Workouts (Physical)
  - Heart Rate Variability (Emotional)
  - Mindful Minutes (Emotional)
  - Respiratory Rate (Mental)
  - Resting Energy (Energy)
  - Body Mass (Energy)
  - VO2 Max (Energy)
- Toggle switches for each data type
- Category labels (Physical, Emotional, Mental, Energy)
- Icons for each data type
- Info note about iOS Settings
- "Continue" button → Requests permissions and navigates to sync screen

**Navigation:**
- Back button → Returns to intro screen
- Continue button → Requests HealthKit permissions → `/apple-health-sync`

### 4. Screen 3: Health Data Sync
**File:** `app/apple-health-sync.tsx`

**Purpose:** Shows progress while syncing health data to Supabase

**Features:**
- Progress indicator (spinner during sync, checkmark on success)
- Status text showing current step:
  - "Connecting to Apple Health..."
  - "Fetching health data..."
  - "Syncing to cloud..."
  - "Sync complete!"
- Results display:
  - Number of records synced
  - Error count (if any)
  - Success message
- Auto-navigation to Health screen after successful sync (2 second delay)
- Error handling with retry option

**Navigation:**
- Cancel button (during sync) → Returns to previous screen
- Auto-navigation → `/(tabs)/health` (on success)
- Try Again button (on error) → Returns to permissions screen
- Continue Anyway button (on error) → Goes to Health screen

## Integration Points

### Updated Files

1. **`app/(tabs)/health.tsx`**
   - Updated "Connect Apple Health" button to navigate to `/connect-apple-health`
   - Added manual sync handler for already-connected users

2. **`app/(tabs)/data.tsx`**
   - Updated Apple Health device card to navigate to `/connect-apple-health`

### New Files Created

1. `app/connect-apple-health.tsx` - Intro screen
2. `app/apple-health-permissions.tsx` - Permissions selection
3. `app/apple-health-sync.tsx` - Sync progress screen

## User Journey Diagram

```
[Health/Data Screen]
    ↓ (Tap "Connect Apple Health")
[Screen 1: Connect Apple Health]
    ↓ (Tap "Connect Apple Health")
[Screen 2: Apple Health Permissions]
    ↓ (Select types, tap "Continue")
[HealthKit Permission Dialog]
    ↓ (Grant permissions)
[Screen 3: Health Data Sync]
    ↓ (Sync completes)
[Health Screen] (with synced data)
```

## Technical Details

### Permission Flow
1. User selects data types in Screen 2
2. App requests HealthKit permissions for all selected types
3. iOS shows native permission dialog
4. User grants/denies permissions
5. App proceeds to sync screen

### Sync Process
1. Fetches health data from HealthKit (last 30 days)
2. Transforms data to Supabase format
3. Syncs to `health_data` table
4. Clears AI context cache
5. Shows results and navigates to Health screen

### Error Handling
- HealthKit unavailable → Shows alert with instructions
- Permissions denied → Shows alert with Settings link
- Sync errors → Shows error screen with retry option
- Partial success → Shows warning with record count

## Design Alignment

All three screens match the Figma designs:
- ✅ Header with back button
- ✅ Consistent typography and spacing
- ✅ Material Symbols icons
- ✅ Primary color scheme
- ✅ Button styles and layouts
- ✅ Scrollable content areas
- ✅ Progress indicators

## Testing Checklist

- [ ] Screen 1 displays correctly
- [ ] Navigation from Health/Data screens works
- [ ] Screen 2 shows all 12 data types
- [ ] Toggles work correctly
- [ ] Continue button validates selection
- [ ] HealthKit permission dialog appears
- [ ] Screen 3 shows progress correctly
- [ ] Sync completes successfully
- [ ] Auto-navigation works
- [ ] Error states display correctly
- [ ] Back navigation works on all screens

## Next Steps

1. Test the complete flow on a physical device
2. Verify all icons render correctly
3. Test error scenarios
4. Add analytics tracking (optional)
5. Consider adding onboarding skip logic (remember user preference)
