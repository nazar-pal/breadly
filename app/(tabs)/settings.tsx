import { SignOutButton } from '@/components/auth/SignOutButton';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { currencies, useCurrency } from '@/context/CurrencyContext';
import {
  useTheme,
  useThemedStyles,
  type ThemePreference,
  type ThemedStylesProps,
} from '@/context/ThemeContext';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import {
  ChevronRight,
  DollarSign,
  Moon,
  Smartphone,
  Sun,
  User,
} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Create themed styles using the new useThemedStyles hook
const createThemedStyles = ({
  colors,
  spacing,
  borderRadius,
}: ThemedStylesProps) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
    },
    scrollContent: {
      paddingHorizontal: spacing.md,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginVertical: spacing.md,
      color: colors.text,
    },
    separator: {
      height: 1,
      width: '100%',
      backgroundColor: colors.border,
    },
    authButtons: {
      gap: spacing.sm,
    },
  });

export default function SettingsScreen() {
  const { colors, spacing, preference, setThemePreference, isLoading } =
    useTheme();
  const { currency, setCurrency } = useCurrency();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const themedStyles = useThemedStyles(createThemedStyles);

  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false);

  // Handle theme preference change
  const handleThemeChange = async (newPreference: ThemePreference) => {
    try {
      await setThemePreference(newPreference);
    } catch (error) {
      console.error('Failed to update theme:', error);
      // You might want to show an error toast here
    }
  };

  // Show loading indicator while theme is loading
  if (isLoading) {
    return (
      <View
        style={[
          themedStyles.container,
          themedStyles.loadingContainer,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        themedStyles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={themedStyles.header}>
        <Text style={themedStyles.screenTitle}>Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          themedStyles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <SignedIn>
          <Card>
            <View style={styles.accountSection}>
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <User size={32} color={colors.text} />
              </View>
              <View style={styles.accountInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username || 'User'}
                </Text>
                <Text
                  style={[styles.userEmail, { color: colors.textSecondary }]}
                >
                  {user?.emailAddresses[0]?.emailAddress || 'No email'}
                </Text>
              </View>
            </View>
            <View
              style={[themedStyles.separator, { marginVertical: spacing.md }]}
            />
            <SignOutButton />
          </Card>
        </SignedIn>

        <SignedOut>
          <Card>
            <View style={styles.authSection}>
              <Text style={[styles.authTitle, { color: colors.text }]}>
                Sign in to access your account
              </Text>
              <Text
                style={[styles.authSubtitle, { color: colors.textSecondary }]}
              >
                Sign in or create an account to sync your data across devices
              </Text>
              <View style={themedStyles.authButtons}>
                <Link href="/sign-in" asChild>
                  <Button>Sign In</Button>
                </Link>
                <Link href="/sign-up" asChild>
                  <Button variant="secondary">Sign Up</Button>
                </Link>
              </View>
            </View>
          </Card>
        </SignedOut>

        <Text style={[themedStyles.sectionTitle, { marginTop: spacing.lg }]}>
          Preferences
        </Text>
        <Card>
          <Pressable
            style={styles.settingItem}
            onPress={() => setShowCurrencyModal(!showCurrencyModal)}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <DollarSign size={20} color={colors.text} />
              </View>
              <View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Default Currency
                </Text>
                <Text
                  style={[
                    styles.settingSubtext,
                    { color: colors.textSecondary },
                  ]}
                >
                  {currency.name} ({currency.symbol})
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Pressable>

          <View
            style={[styles.separator, { backgroundColor: colors.border }]}
          />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Sun size={20} color={colors.text} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>
                Light Mode
              </Text>
            </View>
            <Switch
              value={preference === 'light'}
              onValueChange={(value) =>
                handleThemeChange(value ? 'light' : 'system')
              }
              trackColor={{ false: colors.secondary, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[styles.separator, { backgroundColor: colors.border }]}
          />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Moon size={20} color={colors.text} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={preference === 'dark'}
              onValueChange={(value) =>
                handleThemeChange(value ? 'dark' : 'system')
              }
              trackColor={{ false: colors.secondary, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[styles.separator, { backgroundColor: colors.border }]}
          />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Smartphone size={20} color={colors.text} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>
                Use System Settings
              </Text>
            </View>
            <Switch
              value={preference === 'system'}
              onValueChange={(value) =>
                handleThemeChange(value ? 'system' : 'light')
              }
              trackColor={{ false: colors.secondary, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {showCurrencyModal && (
          <Card style={styles.currencyModal}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Currency
            </Text>
            {currencies.map((curr) => (
              <Pressable
                key={curr.code}
                style={[
                  styles.currencyOption,
                  curr.code === currency.code && {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => {
                  setCurrency(curr);
                  setShowCurrencyModal(false);
                }}
              >
                <Text
                  style={[
                    styles.currencyText,
                    {
                      color:
                        curr.code === currency.code ? '#FFFFFF' : colors.text,
                    },
                  ]}
                >
                  {curr.symbol} - {curr.name}
                </Text>
                {curr.code === currency.code && (
                  <View
                    style={[
                      styles.selectedIndicator,
                      { backgroundColor: '#FFFFFF' },
                    ]}
                  />
                )}
              </Pressable>
            ))}
          </Card>
        )}

        <Text
          style={[
            styles.versionText,
            { color: colors.textSecondary, marginTop: spacing.xl },
          ]}
        >
          Breadly v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  accountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  authSection: {
    paddingVertical: 8,
  },
  authTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  authButtons: {
    gap: 12,
  },
  authButton: {
    marginBottom: 0,
  },
  separator: {
    height: 1,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  settingSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
  },
  currencyModal: {
    marginTop: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  currencyText: {
    fontSize: 16,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
