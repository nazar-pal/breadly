import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useCurrency, currencies } from '@/context/CurrencyContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Moon, Sun, Smartphone, LogOut, User, DollarSign, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors, spacing, isDark, updateTheme, themePreference } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const insets = useSafeAreaInsets();

  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Settings
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
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
                John Doe
              </Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                john.doe@example.com
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.separator,
              { backgroundColor: colors.border, marginVertical: spacing.md },
            ]}
          />
          <Button
            variant="outline"
            leftIcon={<LogOut size={18} color={colors.text} />}
          >
            Sign Out
          </Button>
        </Card>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, marginTop: spacing.lg },
          ]}
        >
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
                <Text style={[styles.settingSubtext, { color: colors.textSecondary }]}>
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
              value={themePreference === 'light'}
              onValueChange={(value) => updateTheme(value ? 'light' : 'dark')}
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
              value={themePreference === 'dark'}
              onValueChange={(value) => updateTheme(value ? 'dark' : 'light')}
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
              value={themePreference === 'system'}
              onValueChange={(value) =>
                updateTheme(value ? 'system' : isDark ? 'dark' : 'light')
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