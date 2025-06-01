import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Camera, Upload } from 'lucide-react-native';

export default function PhotoExpenseScreen() {
  const { colors } = useTheme();

  const handleTakePhoto = () => {
    // In a real app, this would launch the camera
  };

  const handleUploadPhoto = () => {
    // In a real app, this would launch the image picker
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Card style={styles.cameraPlaceholder}>
          <View style={[styles.cameraIcon, { backgroundColor: colors.secondary }]}>
            <Camera size={48} color={colors.text} />
          </View>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            Take a photo of your receipt for automatic expense entry
          </Text>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            variant="primary"
            onPress={handleTakePhoto}
            leftIcon={<Camera size={20} color="#FFFFFF" />}
            style={{ flex: 1, marginRight: 8 }}>
            Take Photo
          </Button>
          <Button
            variant="outline"
            onPress={handleUploadPhoto}
            leftIcon={<Upload size={20} color={colors.text} />}
            style={{ flex: 1 }}>
            Upload
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cameraPlaceholder: {
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    textAlign: 'center',
    marginHorizontal: 24,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
});