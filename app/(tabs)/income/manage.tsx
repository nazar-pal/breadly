import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockIncomeSources } from '@/data/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import IncomeSourceCard from '@/components/income/IncomeSourceCard';
import IncomeSourceForm from '@/components/income/IncomeSourceForm';

export default function ManageIncomeSourcesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [sources, setSources] = useState(mockIncomeSources);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSource, setEditingSource] = useState<string | null>(null);

  const handleAddSource = () => {
    setEditingSource(null);
    setModalVisible(true);
  };

  const handleEditSource = (id: string) => {
    setEditingSource(id);
    setModalVisible(true);
  };

  const handleDeleteSource = (id: string) => {
    if (id === 'cash' || id === 'credit-card') {
      // Don't allow deleting default sources
      return;
    }
    setSources(sources.filter((source) => source.id !== id));
  };

  const handleSubmit = (data: { name: string }) => {
    if (editingSource) {
      setSources(
        sources.map((source) =>
          source.id === editingSource
            ? { ...source, name: data.name }
            : source
        )
      );
    } else {
      const newSource = {
        id: Date.now().toString(),
        name: data.name,
      };
      setSources([...sources, newSource]);
    }
    setModalVisible(false);
    setEditingSource(null);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {sources.map((source) => (
          <IncomeSourceCard
            key={source.id}
            source={source}
            onEdit={handleEditSource}
            onDelete={handleDeleteSource}
            isDefault={source.id === 'cash' || source.id === 'credit-card'}
          />
        ))}

        <Button
          variant="outline"
          onPress={handleAddSource}
          leftIcon={<Plus size={20} color={colors.text} />}
          style={styles.addButton}
        >
          Add New Source
        </Button>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingSource ? 'Edit Source' : 'Add New Source'}
            </Text>
            <IncomeSourceForm
              onSubmit={handleSubmit}
              onCancel={() => setModalVisible(false)}
              initialData={
                editingSource
                  ? sources.find((s) => s.id === editingSource)
                  : undefined
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  addButton: {
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
});