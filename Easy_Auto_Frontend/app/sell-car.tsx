import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SellCarScreen() {
  const router = useRouter();
  
  // Form state
  const [carDetails, setCarDetails] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    condition: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    engineCapacity: '',
    price: '',
    description: '',
    contactNumber: '',
    email: '',
    location: '',
    negotiable: false,
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [hidePhoneNumber, setHidePhoneNumber] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setCarDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = [
      { key: 'title', label: 'Title' },
      { key: 'brand', label: 'Brand' },
      { key: 'model', label: 'Model' },
      { key: 'year', label: 'Year' },
      { key: 'price', label: 'Price' },
      { key: 'contactNumber', label: 'Contact Number' },
      { key: 'email', label: 'Email' }, // Added email as required
    ];
    const missing = requiredFields.filter(f => !(carDetails as any)[f.key]).map(f => f.label);
    setMissingFields(missing);
    if (missing.length > 0) {
      return;
    }
    
    // Here you would typically send the data to your backend
    Alert.alert('Success', 'Your car listing has been submitted successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Basic Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Yaris Cross"
              value={carDetails.title}
              onChangeText={(value) => handleInputChange('title', value)}
            />

            <Text style={styles.label}>Price ($)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <TextInput
                style={[styles.input, { width: 120, marginBottom: 0, marginRight: 12 }]}
                placeholder="125,500,000"
                value={carDetails.price}
                onChangeText={(value) => handleInputChange('price', value)}
                keyboardType="numeric"
              />
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => handleInputChange('negotiable', !carDetails.negotiable)}
              >
                <View style={[styles.checkbox, carDetails.negotiable && styles.checkboxChecked]}>
                  {carDetails.negotiable && (
                    <View style={styles.checkboxInner} />
                  )}
                </View>
                <Text style={styles.negotiableText}>Negotiable</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Nugegoda, Sri Lanka"
              value={carDetails.location}
              onChangeText={(value) => handleInputChange('location', value)}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.descriptionTextArea]}
              placeholder="The all-new Toyota Yaris Cross combines compact design with SUV styling, offering excellent space for all your safety features. Designed for city driving and highway adventures, it delivers an unbeatable smart connectivity and excellent fuel economy."
              value={carDetails.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Car Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Car Details</Text>
            
            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Text style={styles.label}>Brand</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Toyota"
                  value={carDetails.brand}
                  onChangeText={(value) => handleInputChange('brand', value)}
                />
              </View>
              
              <View style={styles.formHalf}>
                <Text style={styles.label}>Model</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Yaris Cross"
                  value={carDetails.model}
                  onChangeText={(value) => handleInputChange('model', value)}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Text style={styles.label}>Year</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2025"
                  value={carDetails.year}
                  onChangeText={(value) => handleInputChange('year', value)}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.formHalf}>
                <Text style={styles.label}>Mileage</Text>
                <TextInput
                  style={styles.input}
                  placeholder="75,000Km"
                  value={carDetails.mileage}
                  onChangeText={(value) => handleInputChange('mileage', value)}
                />
              </View>
            </View>

            <Text style={styles.label}>Transmission :</Text>
            <TextInput
              style={styles.input}
              placeholder="Automatic"
              value={carDetails.transmission}
              onChangeText={(value) => handleInputChange('transmission', value)}
            />

            <Text style={styles.label}>Fuel Type:</Text>
            <TextInput
              style={styles.input}
              placeholder="Petrol/Hybrid"
              value={carDetails.fuelType}
              onChangeText={(value) => handleInputChange('fuelType', value)}
            />
          </View>

          {/* Car Photos Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Car Photos</Text>
            <Text style={styles.sectionSubtitle}>Upload up to 5 photos. First photo will be the cover image</Text>
            <View style={{ alignItems: 'center' }}>
              <View style={styles.photoRowUniform}>
                {[0,1,2].map((i) => (
                  selectedImages[i] ? (
                    <View key={i} style={styles.photoContainerUniform}>
                      <Image source={{ uri: selectedImages[i] }} style={styles.carPhotoUniform} />
                      <TouchableOpacity 
                        style={styles.removePhotoButtonUniform}
                        onPress={() => {
                          setSelectedImages(prev => prev.filter((_, idx) => idx !== i));
                        }}
                      >
                        <Ionicons name="close" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View key={i} style={styles.photoPlaceholderUniform}>
                      <Ionicons name="car-outline" size={32} color="#C1C9D2" />
                    </View>
                  )
                ))}
              </View>
              <View style={styles.photoRowUniform}>
                {[3,4].map((i) => (
                  selectedImages[i] ? (
                    <View key={i} style={styles.photoContainerUniform}>
                      <Image source={{ uri: selectedImages[i] }} style={styles.carPhotoUniform} />
                      <TouchableOpacity 
                        style={styles.removePhotoButtonUniform}
                        onPress={() => {
                          setSelectedImages(prev => prev.filter((_, idx) => idx !== i));
                        }}
                      >
                        <Ionicons name="close" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View key={i} style={styles.photoPlaceholderUniform}>
                      <Ionicons name="car-outline" size={32} color="#C1C9D2" />
                    </View>
                  )
                ))}
                {selectedImages.length < 5 && (
                  <TouchableOpacity style={styles.addPhotoButtonUniform}>
                    <Text style={styles.addPhotoTextUniform}>Add Photo</Text>
                    <Ionicons name="add" size={32} color="#235CF8" style={{ marginTop: 2 }} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Additional Images Section */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Additional Images</Text>
              <View style={styles.pricePill}><Text style={styles.pricePillText}>$2.00/image</Text></View>
            </View>
            <View style={{ alignItems: 'center' }}>
              {/* First row: 3 images */}
              <View style={styles.photoRowUniform}>
                {[0,1,2].map((i) => (
                  additionalImages && additionalImages[i] ? (
                    <View key={i} style={styles.photoContainerUniform}>
                      <Image source={{ uri: additionalImages[i] }} style={styles.carPhotoUniform} />
                      <TouchableOpacity 
                        style={styles.removePhotoButtonUniform}
                        onPress={() => {
                          setAdditionalImages(prev => prev.filter((_, idx) => idx !== i));
                        }}
                      >
                        <Ionicons name="close" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View key={i} style={styles.photoPlaceholderUniform}>
                      <Ionicons name="car-outline" size={32} color="#C1C9D2" />
                    </View>
                  )
                ))}
              </View>
              {/* Second row: 2 images + add photo button if needed */}
              <View style={styles.photoRowUniform}>
                {[3,4].map((i) => (
                  additionalImages && additionalImages[i] ? (
                    <View key={i} style={styles.photoContainerUniform}>
                      <Image source={{ uri: additionalImages[i] }} style={styles.carPhotoUniform} />
                      <TouchableOpacity 
                        style={styles.removePhotoButtonUniform}
                        onPress={() => {
                          setAdditionalImages(prev => prev.filter((_, idx) => idx !== i));
                        }}
                      >
                        <Ionicons name="close" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View key={i} style={styles.photoPlaceholderUniform}>
                      <Ionicons name="car-outline" size={32} color="#C1C9D2" />
                    </View>
                  )
                ))}
                {additionalImages.length < 5 && (
                  <TouchableOpacity style={styles.addPhotoButtonUniform}>
                    <Text style={styles.addPhotoTextUniform}>Add Photo</Text>
                    <Ionicons name="add" size={32} color="#235CF8" style={{ marginTop: 2 }} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Text style={[styles.sectionSubtitle, { textAlign: 'center', marginTop: 8 }]}>Add more images for more sales and engagements.</Text>
          </View>

          {/* Contact Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Details</Text>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={carDetails.email}
              onChangeText={(value) => handleInputChange('email', value)}
            />
            <View style={styles.contactBox}>
              <Text style={styles.contactBoxTitle}>Add phone number and Verify</Text>
              <View style={styles.contactRow}>
                <TextInput
                  style={styles.contactPhoneInput}
                  placeholder="075 2597638"
                  value={carDetails.contactNumber}
                  onChangeText={(value) => handleInputChange('contactNumber', value)}
                  keyboardType="phone-pad"
                />
                <TouchableOpacity style={styles.contactAddButton}>
                  <Text style={styles.contactAddButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.contactInfoBox}>
                <Text style={styles.contactInfoText}>Buyers can WhatsApp your first number. Make sure it&apos;s active</Text>
              </View>
              <View style={styles.contactCheckboxRow}>
                <TouchableOpacity style={styles.contactCheckboxOuter} onPress={() => setHidePhoneNumber(prev => !prev)}>
                  {hidePhoneNumber && (
                    <View style={styles.contactCheckboxInner}>
                      <Ionicons name="checkmark" size={14} color="#235CF8" />
                    </View>
                  )}
                </TouchableOpacity>
                <Text style={styles.contactCheckboxLabel}>Hide phone number</Text>
              </View>
            </View>
          </View>

          {/* Show missing fields message above the submit buttons */}
          {missingFields.length > 0 && (
            <View style={{ marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FFF4F4', borderRadius: 8, padding: 12, borderColor: '#EF4444', borderWidth: 1 }}>
              <Text style={{ color: '#EF4444', fontWeight: 'bold', marginBottom: 4 }}>Required to fill:</Text>
              <Text style={{ color: '#EF4444' }}>{missingFields.join(', ')}</Text>
            </View>
          )}

          {/* Submit Button */}
          <View style={styles.submitSection}>
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewButtonText}>Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAdButton} onPress={handleSubmit}>
              <Text style={styles.postAdButtonText}>Post Ad</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.disclaimer}>
            By posting this listing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#235CF8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40, // Balance the back button
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  required: {
    color: '#EF4444',
  },
  photoScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  addPhotoButton: {
    width: 120,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#235CF8',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addPhotoText: {
    fontSize: 12,
    color: '#235CF8',
    fontWeight: '600',
    marginTop: 4,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  carPhoto: {
    width: 120,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  conditionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  conditionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  conditionButtonActive: {
    backgroundColor: '#235CF8',
    borderColor: '#235CF8',
  },
  conditionButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  conditionButtonTextActive: {
    color: 'white',
  },
  submitSection: {
    margin: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  reviewButton: {
    backgroundColor: 'white',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  reviewButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postAdButton: {
    backgroundColor: '#8EE87C',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postAdButtonText: {
    color: 'Black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 32,
    lineHeight: 18,
  },
  priceContainer: {
    marginBottom: 16,
  },
  priceInput: {
    marginBottom: 8,
  },
  negotiableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#235CF8',
    borderColor: '#235CF8',
  },
  checkboxInner: {
    width: 6,
    height: 6,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  negotiableText: {
    fontSize: 14,
    color: '#374151',
  },
  descriptionTextArea: {
    height: 120,
    paddingTop: 12,
  },
  photoRowUniform: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    justifyContent: 'flex-start',
  },
  photoContainerUniform: {
    position: 'relative',
    width: 70,
    height: 70,
    marginBottom: 12,
    marginRight: 12,
  },
  carPhotoUniform: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  removePhotoButtonUniform: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  photoPlaceholderUniform: {
    width: 70,
    height: 70,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    marginRight: 12,
  },
  addPhotoButtonUniform: {
    width: 70,
    height: 70,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#235CF8',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    marginRight: 12,
    flexDirection: 'column',
  },
  addPhotoTextUniform: {
    fontSize: 12,
    color: '#235CF8',
    fontWeight: '600',
    marginBottom: 2,
  },
  pricePill: {
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  pricePillText: {
    fontSize: 12,
    color: '#0A4D92',
    fontWeight: '500',
  },
  contactBox: {
    backgroundColor: '#F3F8FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  contactBoxTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactPhoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  contactAddButton: {
    backgroundColor: '#235CF8',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactAddButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  contactInfoBox: {
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  contactInfoText: {
    color: '#7A6A00',
    fontSize: 13,
  },
  contactCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  contactCheckboxOuter: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#235CF8', 
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  contactCheckboxInner: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactCheckboxLabel: {
    fontSize: 13,
    color: '#374151',
  },
});
