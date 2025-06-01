import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockIncomeSources } from '@/data/mockData';
import IncomeSourceCard from '@/components/income/IncomeSourceCard';
import IncomeSourceForm from '@/components/income/IncomeSourceForm';
import Button from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';

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
    setSources(sources.filter((source) => source.id !== id));
  };

  const handleSubmit = (data: any) => {
    if (editingSource) {
      setSources(
        sources.map((source) =>
          source.id === editingSource
            ? {
                ...source,
                name: data.name,
                description: data.description || '',
                balance: parseFloat(data.balance),
              }
            : source
        )
      );
    } else {
      const newSource = {
        id: (sources.length + 1).toString(),
        name: data.name,
        description: data.description || '',
        balance: parseFloat(data.balance),
        icon: 'credit-card',
      };
      setSources([...sources, newSource]);
    }
    setModalVisible(false);
  };

  const getEditingSourceData = () => {
    if (!editingSource) return undefined;
    const source = sources.find((s) => s.id === editingSource);
    if (!source) return undefined;
    return {
      name: source.name,
      description: source.description,
      balance: source.balance.toString(),
    };
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Button
          variant="primary"
          onPress={handleAddSource}
          leftIcon={<Plus size={20} color="#FFFFFF" />}
        >
          Add Source
        </Button>
      </View>

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
          />
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingSource ? 'Edit Income Source' : 'Add Income Source'}
            </Text>
            <IncomeSourceForm
              onSubmit={handleSubmit}
              initialData={getEditingSourceData()}
              onCancel={() => setModalVisible(false)}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
});