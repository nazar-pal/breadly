import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Camera, Upload, ArrowLeft } from 'lucide-react-native';

export default function PhotoExpenseScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [photoTaken, setPhotoTaken] = useState(false);

  // This is a placeholder for the receipt image
  const receiptImageUrl = 'https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  const handleTakePhoto = () => {
    // In a real app, this would launch the camera
    setPhotoTaken(true);
  };

  const handleUploadPhoto = () => {
    // In a real app, this would launch the image picker
    setPhotoTaken(true);
  };

  const handleProcessReceipt = () => {
    // In a real app, this would process the receipt using OCR
    // and pre-fill the expense form with the extracted data
    alert('Receipt processed! Continuing to form...');
    router.push('/add/index');
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Receipt Photo
        </Text>
      </View>

      <View style={styles.content}>
        {photoTaken ? (
          <View>
            <Card style={styles.imageCard}>
              <Image
                source={{ uri: receiptImageUrl }}
                style={styles.receiptImage}
                resizeMode="contain"
              />
            </Card>
            <Text style={[styles.processingText, { color: colors.textSecondary }]}>
              Photo captured successfully
            </Text>
            <Button
              variant="primary"
              onPress={handleProcessReceipt}
              style={{ marginTop: spacing.lg }}
            >
              Process Receipt
            </Button>
            <Button
              variant="outline"
              onPress={() => setPhotoTaken(false)}
              style={{ marginTop: spacing.md }}
            >
              Retake Photo
            </Button>
          </View>
        ) : (
          <View>
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
                style={{ flex: 1, marginRight: 8 }}
              >
                Take Photo
              </Button>
              <Button
                variant="outline"
                onPress={handleUploadPhoto}
                leftIcon={<Upload size={20} color={colors.text} />}
                style={{ flex: 1 }}
              >
                Upload
              </Button>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
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
  imageCard: {
    padding: 0,
    overflow: 'hidden',
  },
  receiptImage: {
    width: '100%',
    height: 400,
  },
  processingText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
});