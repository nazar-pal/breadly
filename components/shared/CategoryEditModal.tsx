import { useCategoryContext } from '@/context/CategoryContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Briefcase,
  Building,
  Bus,
  Check,
  Coffee,
  DollarSign,
  Film,
  Heart,
  Home,
  PiggyBank,
  Shirt,
  Target,
  TrendingUp,
  Users,
  UtensilsCrossed,
  X,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Available icons for both expense and income categories
const availableIcons = {
  Coffee,
  UtensilsCrossed,
  Film,
  Bus,
  Heart,
  Home,
  Users,
  Shirt,
  Briefcase,
  DollarSign,
  TrendingUp,
  Building,
  Target,
  PiggyBank,
};

const iconNames = Object.keys(
  availableIcons,
) as (keyof typeof availableIcons)[];

export default function CategoryEditModal() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    editModalVisible,
    categoryToEdit,
    currentType,
    handleSaveCategory,
    handleCloseEditModal,
  } = useCategoryContext();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] =
    useState<keyof typeof availableIcons>('Home');

  useEffect(() => {
    if (categoryToEdit) {
      console.log('CategoryEditModal: Setting up category:', categoryToEdit);
      setName(categoryToEdit.name);
      setDescription(categoryToEdit.description || '');
      // Try to match the category name to an icon, fallback to Home
      const matchedIcon = iconNames.find(
        (icon) =>
          icon.toLowerCase() === categoryToEdit.name.toLowerCase() ||
          categoryToEdit.name.toLowerCase().includes(icon.toLowerCase()),
      );
      setSelectedIcon(matchedIcon || 'Home');
      console.log('CategoryEditModal: Selected icon:', matchedIcon || 'Home');
    } else {
      // Reset form when no category
      setName('');
      setDescription('');
      setSelectedIcon('Home');
    }
  }, [categoryToEdit]);

  const handleSave = () => {
    if (!categoryToEdit || !name.trim()) {
      console.log('CategoryEditModal: Cannot save - missing category or name');
      return;
    }

    console.log('CategoryEditModal: Saving category:', {
      id: categoryToEdit.id,
      name: name.trim(),
      description: description.trim(),
      iconName: selectedIcon,
    });

    handleSaveCategory({
      id: categoryToEdit.id,
      name: name.trim(),
      description: description.trim(),
      iconName: selectedIcon,
    });
  };

  const getIconBackgroundColor = () => {
    if (currentType === 'income') {
      return colors.success + '20';
    }
    return colors.secondary;
  };

  if (!categoryToEdit) return null;

  return (
    <Modal
      visible={editModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseEditModal}
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.modalOverlay} onPress={handleCloseEditModal} />
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + 16,
              maxHeight: SCREEN_HEIGHT * 0.8,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Edit {currentType === 'expense' ? 'Expense' : 'Income'} Category
            </Text>
            <Pressable
              onPress={handleCloseEditModal}
              style={styles.closeButton}
            >
              <X size={24} color={colors.text} />
            </Pressable>
          </View>

          {/* Debug Info - Remove this in production */}
          <View
            style={[styles.debugInfo, { backgroundColor: colors.secondary }]}
          >
            <Text style={[styles.debugText, { color: colors.textSecondary }]}>
              Category ID: {categoryToEdit?.id} | Name: &ldquo;{name}&rdquo; |
              Icon: {selectedIcon}
            </Text>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Category Name */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Category Name
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
                value={name}
                onChangeText={setName}
                placeholder="Enter category name"
                placeholderTextColor={colors.textSecondary}
                autoFocus
              />
            </View>

            {/* Category Description */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Description (Optional)
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
                value={description}
                onChangeText={setDescription}
                placeholder="Add a description for this category"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Icon Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Choose Icon
              </Text>
              <View style={styles.iconGrid}>
                {iconNames.map((iconName) => {
                  const IconComponent = availableIcons[iconName];
                  const isSelected = selectedIcon === iconName;

                  return (
                    <Pressable
                      key={iconName}
                      style={[
                        styles.iconOption,
                        {
                          backgroundColor: isSelected
                            ? colors.primary + '20'
                            : getIconBackgroundColor(),
                          borderColor: isSelected
                            ? colors.primary
                            : 'transparent',
                        },
                      ]}
                      onPress={() => setSelectedIcon(iconName)}
                    >
                      <IconComponent
                        size={24}
                        color={isSelected ? colors.primary : colors.text}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable
              style={[
                styles.button,
                styles.cancelButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={handleCloseEditModal}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.saveButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Check size={20} color="white" />
              <Text style={[styles.buttonText, { color: 'white' }]}>
                Save Changes
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    minHeight: SCREEN_HEIGHT * 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 8,
  },
  iconOption: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    minHeight: 48,
  },
  cancelButton: {
    flex: 0.4,
  },
  saveButton: {
    flex: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  debugInfo: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
