/**
 * HealthKit Configuration Test Script
 * Checks if HealthKit is properly configured and can be imported
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 HealthKit Configuration Test\n');

// Check 1: Package.json
console.log('1. Checking package.json...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (packageJson.dependencies['@kingstinct/react-native-healthkit']) {
  const version = packageJson.dependencies['@kingstinct/react-native-healthkit'];
  console.log(`   ✅ HealthKit library found: ${version}`);
} else {
  console.log('   ❌ HealthKit library NOT found in package.json');
  process.exit(1);
}

// Check 2: App.json plugin
console.log('\n2. Checking app.json configuration...');
const appJsonPath = path.join(__dirname, '..', 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

const hasHealthKitPlugin = appJson.expo.plugins?.some(
  plugin => Array.isArray(plugin) && plugin[0] === '@kingstinct/react-native-healthkit'
);

if (hasHealthKitPlugin) {
  console.log('   ✅ HealthKit plugin configured in app.json');
  const plugin = appJson.expo.plugins.find(
    p => Array.isArray(p) && p[0] === '@kingstinct/react-native-healthkit'
  );
  if (plugin[1]) {
    console.log('   ✅ Plugin has configuration:', Object.keys(plugin[1]));
  }
} else {
  console.log('   ❌ HealthKit plugin NOT found in app.json');
  process.exit(1);
}

// Check 3: Info.plist permissions
console.log('\n3. Checking Info.plist permissions...');
if (appJson.expo.ios?.infoPlist?.NSHealthShareUsageDescription) {
  console.log('   ✅ NSHealthShareUsageDescription found');
} else {
  console.log('   ⚠️  NSHealthShareUsageDescription not found (may be set by plugin)');
}

if (appJson.expo.ios?.infoPlist?.NSHealthUpdateUsageDescription) {
  console.log('   ✅ NSHealthUpdateUsageDescription found');
} else {
  console.log('   ⚠️  NSHealthUpdateUsageDescription not found (may be set by plugin)');
}

// Check 4: Service files exist
console.log('\n4. Checking service files...');
const serviceFiles = [
  'services/appleHealth.ts',
  'services/healthDataSync.ts',
  'hooks/useAppleHealth.ts'
];

serviceFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} NOT found`);
  }
});

// Check 5: Database schema
console.log('\n5. Checking database schema...');
const schemaPath = path.join(__dirname, 'setup-apple-health-tables.sql');
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  if (schema.includes('health_data')) {
    console.log('   ✅ health_data table schema found');
  } else {
    console.log('   ❌ health_data table NOT found in schema');
  }
} else {
  console.log('   ⚠️  Schema file not found');
}

// Check 6: Node modules
console.log('\n6. Checking node_modules...');
const nodeModulesPath = path.join(__dirname, '..', 'node_modules', '@kingstinct', 'react-native-healthkit');
if (fs.existsSync(nodeModulesPath)) {
  console.log('   ✅ HealthKit library installed in node_modules');
  
  // Check package.json in node_modules
  const libPackageJson = path.join(nodeModulesPath, 'package.json');
  if (fs.existsSync(libPackageJson)) {
    const libInfo = JSON.parse(fs.readFileSync(libPackageJson, 'utf8'));
    console.log(`   ✅ Library version: ${libInfo.version}`);
  }
} else {
  console.log('   ❌ HealthKit library NOT found in node_modules');
  console.log('   💡 Run: npm install');
  process.exit(1);
}

console.log('\n✅ Configuration check complete!');
console.log('\n📝 Next steps:');
console.log('   1. Enable HealthKit in Apple Developer Portal');
console.log('   2. Run: npx expo prebuild --clean --platform ios');
console.log('   3. Build and test on a PHYSICAL device (not simulator)');
console.log('   4. HealthKit will only work on real iOS devices\n');
