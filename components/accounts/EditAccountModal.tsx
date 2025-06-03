import Button from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Check, ChevronDown, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface EditAccountModalProps {
  visible: boolean;
  account: any;
  onSave: (account: any) => void;
  onClose: () => void;
}

export default function EditAccountModal({
  visible,
  account,
  onSave,
  onClose,
}: EditAccountModalProps) {
  const { colors } = useTheme();
  const { currency } = useCurrency();
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    balance: '',
    targetAmount: '',
    initialAmount: '',
    dueDate: '',
    interestRate: '',
    institution: '',
    person: '',
    debtType: 'owed',
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        description: account.description || '',
        balance: account.balance?.toString() || '',
        targetAmount: account.targetAmount?.toString() || '',
        initialAmount: account.initialAmount?.toString() || '',
        dueDate: account.dueDate || '',
        interestRate: account.interestRate?.toString() || '',
        institution: account.institution || '',
        person: account.person || '',
        debtType: account.debtType || 'owed',
      });
    }
  }, [account]);

  const handleSave = () => {
    const updatedAccount = {
      ...account,
      ...formData,
      balance: parseFloat(formData.balance),
      targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : undefined,
      initialAmount: formData.initialAmount ? parseFloat(formData.initialAmount) : undefined,
      interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
    };
    onSave(updatedAccount);
  };

  const getTitle = () => {
    if (!account) return 'Add Account';
    if (!account.id) return `Add ${account.type} Account`;
    return `Edit ${account.type} Account`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {getTitle()}
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.form}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.formContent,
              { paddingBottom: insets.bottom + 16 },
            ]}
          >
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Account Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
                placeholder="Enter account name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Description
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    color: colors.text,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, description: text }))
                }
                placeholder="Enter description"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Balance</Text>
              <View style={styles.currencyInput}>
                <Text
                  style={[styles.currencySymbol, { color: colors.textSecondary }]}
                >
                  {currency.symbol}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      flex: 1,
                    },
                  ]}
                  value={formData.balance}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, balance: text }))
                  }
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            {account?.type === 'savings' && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Target Amount (Optional)
                </Text>
                <View style={styles.currencyInput}>
                  <Text
                    style={[
                      styles.currencySymbol,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {currency.symbol}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        flex: 1,
                      },
                    ]}
                    value={formData.targetAmount}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, targetAmount: text }))
                    }
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>
            )}

            {account?.type === 'debt' && (
              <>
                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Debt Type
                  </Text>
                  <View style={styles.debtTypeContainer}>
                    <Pressable
                      style={[
                        styles.debtTypeButton,
                        {
                          backgroundColor:
                            formData.debtType === 'owed'
                              ? colors.primary
                              : colors.card,
                        },
                      ]}
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, debtType: 'owed' }))
                      }
                    >
                      <Text
                        style={[
                          styles.debtTypeText,
                          {
                            color:
                              formData.debtType === 'owed'
                                ? '#FFFFFF'
                                : colors.text,
                          },
                        ]}
                      >
                        I Owe
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.debtTypeButton,
                        {
                          backgroundColor:
                            formData.debtType === 'owedTo'
                              ? colors.primary
                              : colors.card,
                        },
                      ]}
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, debtType: 'owedTo' }))
                      }
                    >
                      <Text
                        style={[
                          styles.debtTypeText,
                          {
                            color:
                              formData.debtType === 'owedTo'
                                ? '#FFFFFF'
                                : colors.text,
                          },
                        ]}
                      >
                        Owed to Me
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Initial Amount
                  </Text>
                  <View style={styles.currencyInput}>
                    <Text
                      style={[
                        styles.currencySymbol,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {currency.symbol}
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          color: colors.text,
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                          flex: 1,
                        },
                      ]}
                      value={formData.initialAmount}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, initialAmount: text }))
                      }
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Due Date (Optional)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    value={formData.dueDate}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, dueDate: text }))
                    }
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Interest Rate % (Optional)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    value={formData.interestRate}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, interestRate: text }))
                    }
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    {formData.debtType === 'owed'
                      ? 'Institution/Person'
                      : 'Person Name'}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    value={
                      formData.debtType === 'owed'
                        ? formData.institution || formData.person
                        : formData.person
                    }
                    onChangeText={(text) =>
                      setFormData((prev) => ({
                        ...prev,
                        [formData.debtType === 'owed'
                          ? 'institution'
                          : 'person']: text,
                      }))
                    }
                    placeholder={
                      formData.debtType === 'owed'
                        ? 'Enter institution or person name'
                        : 'Enter person name'
                    }
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Button
              variant="outline"
              onPress={onClose}
              style={{ flex: 1, marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={handleSave}
              style={{ flex: 1 }}
              leftIcon={<Check size={20} color="#FFFFFF" />}
            >
              Save
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justify

Content: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  currencyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
  },
  debtTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  debtTypeButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debtTypeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
});