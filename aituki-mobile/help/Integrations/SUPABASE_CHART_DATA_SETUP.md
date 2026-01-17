# Supabase Chart Data Integration Guide

This guide explains how to set up Supabase tables and fetch chart data for the health metrics screens.

## 📋 Table of Contents

1. [Database Schema](#database-schema)
2. [Setting Up Tables in Supabase](#setting-up-tables-in-supabase)
3. [Using the Chart Data Service](#using-the-chart-data-service)
4. [Using the React Hook](#using-the-react-hook)
5. [Example Implementation](#example-implementation)

---

## 🗄️ Database Schema

### 1. Physical Scores Table

```sql
CREATE TABLE physical_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  label TEXT,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  timeframe TEXT DEFAULT 'week',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_physical_scores_user_date ON physical_scores(user_id, date DESC);

-- Row Level Security (RLS)
ALTER TABLE physical_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own physical scores"
  ON physical_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own physical scores"
  ON physical_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own physical scores"
  ON physical_scores FOR UPDATE
  USING (auth.uid() = user_id);
```

### 2. Steps Data Table

```sql
CREATE TABLE steps_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quarter TEXT NOT NULL CHECK (quarter IN ('q1', 'q2', 'q3', 'q4')),
  walking INTEGER NOT NULL DEFAULT 0,
  running INTEGER NOT NULL DEFAULT 0,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quarter, date)
);

-- Index for faster queries
CREATE INDEX idx_steps_data_user_date ON steps_data(user_id, date DESC);

-- Row Level Security (RLS)
ALTER TABLE steps_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own steps data"
  ON steps_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own steps data"
  ON steps_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own steps data"
  ON steps_data FOR UPDATE
  USING (auth.uid() = user_id);
```

### 3. Heart Rate Data Table

```sql
CREATE TABLE heart_rate_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  heart_rate INTEGER NOT NULL,
  time TEXT NOT NULL, -- Format: 'HH:MM' (e.g., '08:00')
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_heart_rate_data_user_date ON heart_rate_data(user_id, date DESC);

-- Row Level Security (RLS)
ALTER TABLE heart_rate_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own heart rate data"
  ON heart_rate_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own heart rate data"
  ON heart_rate_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own heart rate data"
  ON heart_rate_data FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 🛠️ Setting Up Tables in Supabase

1. **Open Supabase Dashboard**
   - Go to your Supabase project: https://hhdntbgtedclqqufpzfj.supabase.co
   - Navigate to **SQL Editor**

2. **Create Tables**
   - Copy and paste each CREATE TABLE statement above
   - Run each SQL statement to create the tables

3. **Verify Tables**
   - Go to **Table Editor** in Supabase
   - You should see: `physical_scores`, `steps_data`, and `heart_rate_data`

---

## 📦 Using the Chart Data Service

The service functions are in `services/chartData.ts`:

```typescript
import { 
  fetchPhysicalScoreData, 
  fetchStepsData, 
  fetchHeartRateData 
} from '@/services/chartData';

// Fetch Physical Score
const physicalScore = await fetchPhysicalScoreData();
// Returns: { score: 179, percentage: 56, label: "Good week", ... }

// Fetch Steps Data
const stepsData = await fetchStepsData();
// Returns: { walkingData: [45, 35, 50, 55], runningData: [20, 30, 25, 20], total: 56,348 }

// Fetch Heart Rate Data
const heartRateData = await fetchHeartRateData();
// Returns: { heartRateData: [85, 95, 102, 98, 105], average: 97 }
```

---

## 🎣 Using the React Hook

The `useChartData` hook handles loading states and errors automatically:

```typescript
import { useChartData } from '@/hooks/useChartData';

function PhysicalTab() {
  const {
    physicalScore,
    stepsData,
    heartRateData,
    loading,
    refresh,
  } = useChartData({
    autoRefresh: true, // Auto-refresh every 60 seconds
    refreshInterval: 60000,
  });

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <PhysicalScoreChart
        score={physicalScore?.score || 179}
        percentage={physicalScore?.percentage || 56}
        label={physicalScore?.label || 'Good week'}
      />
      <StepsChart
        walkingData={stepsData?.walkingData || [45, 35, 50, 55]}
        runningData={stepsData?.runningData || [20, 30, 25, 20]}
        value={stepsData?.total.toLocaleString() || '56,348'}
      />
      <HeartRateChart
        heartRateData={heartRateData?.heartRateData || [85, 95, 102, 98, 105]}
        value={heartRateData?.average.toString() || '102'}
      />
    </View>
  );
}
```

---

## 📝 Example Implementation

Here's how to update the `PhysicalContent` component in `app/(tabs)/health.tsx`:

```typescript
import { useChartData } from '@/hooks/useChartData';
import { ActivityIndicator, View } from 'react-native';

// Physical Tab Content
function PhysicalContent() {
  const {
    physicalScore,
    stepsData,
    heartRateData,
    loading,
    refresh,
  } = useChartData({
    autoRefresh: true,
    refreshInterval: 60000, // Refresh every minute
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <View style={styles.chartsContainer}>
        <PhysicalScoreChart
          score={physicalScore?.score || 179}
          subtitle={physicalScore?.timeframe ? `Last ${physicalScore.timeframe}` : "Last 7 days"}
          percentage={physicalScore?.percentage || 56}
          label={physicalScore?.label || 'Good week'}
        />
        
        <StepsChart
          value={stepsData?.total.toLocaleString() || '56,348'}
          subtitle="15% above average"
          walkingData={stepsData?.walkingData || [45, 35, 50, 55]}
          runningData={stepsData?.runningData || [20, 30, 25, 20]}
        />
        
        <HeartRateChart
          value={heartRateData?.average.toString() || '102'}
          subtitle="15% above average"
          timeLabels={['08:00', '10:00', '12:00', '14:00', '16:00']}
          heartRateData={heartRateData?.heartRateData || [85, 95, 102, 98, 105]}
        />
      </View>
    </View>
  );
}
```

---

## 🔄 Real-time Updates (Optional)

To subscribe to real-time updates from Supabase:

```typescript
import { supabase } from '@/services/supabase';

useEffect(() => {
  // Subscribe to real-time changes
  const subscription = supabase
    .channel('chart-data-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'physical_scores',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Physical score updated:', payload);
        refresh(); // Refresh chart data
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [userId]);
```

---

## 📊 Sample Data Insert (for Testing)

```sql
-- Insert sample physical score (replace USER_ID with actual user ID)
INSERT INTO physical_scores (user_id, score, percentage, label, timeframe)
VALUES (
  'YOUR_USER_ID_HERE',
  179,
  56,
  'Good week',
  'week'
);

-- Insert sample steps data
INSERT INTO steps_data (user_id, quarter, walking, running, date)
VALUES
  ('YOUR_USER_ID_HERE', 'q1', 45, 20, NOW()),
  ('YOUR_USER_ID_HERE', 'q2', 35, 30, NOW()),
  ('YOUR_USER_ID_HERE', 'q3', 50, 25, NOW()),
  ('YOUR_USER_ID_HERE', 'q4', 55, 20, NOW());

-- Insert sample heart rate data
INSERT INTO heart_rate_data (user_id, heart_rate, time, date)
VALUES
  ('YOUR_USER_ID_HERE', 85, '08:00', NOW()),
  ('YOUR_USER_ID_HERE', 95, '10:00', NOW()),
  ('YOUR_USER_ID_HERE', 102, '12:00', NOW()),
  ('YOUR_USER_ID_HERE', 98, '14:00', NOW()),
  ('YOUR_USER_ID_HERE', 105, '16:00', NOW());
```

---

## 🚀 Next Steps

1. **Create the tables** in Supabase using the SQL above
2. **Insert sample data** for testing
3. **Update the health screen** to use `useChartData` hook
4. **Test the integration** and verify data flows correctly
5. **Add error handling** and loading states as needed

For more details, see the implementation in:
- `services/chartData.ts` - Data fetching functions
- `hooks/useChartData.ts` - React hook for chart data

