export const translations = {
  tr: {
    // Header
    title: 'Çevir Kazan',
    subtitle: 'Detaylarınızı girin ve harika ödüller kazanmak için çevirin!',
    oneSpinPerPhone: 'Her telefon numarası için bir çevirme hakkı.',
    
    // Form
    enterDetails: 'Detaylarınızı Girin',
    fullName: 'Ad Soyad',
    fullNamePlaceholder: 'Adınızı ve soyadınızı girin',
    phoneNumber: 'Telefon Numarası',
    phoneNumberPlaceholder: 'Telefon numaranızı girin',
    spinButton: 'ÇARKI ÇEVİR!',
    checking: 'Kontrol ediliyor',
    spinning: 'Çevriliyor...',
    
    // Validation
    nameRequired: 'Ad gereklidir',
    nameMaxLength: 'Ad 100 karakterden az olmalıdır',
    phoneMinLength: 'Telefon numarası en az 11 haneli olmalıdır',
    phoneMaxLength: 'Telefon numarası en fazla 15 haneli olmalıdır',
    phoneOnlyDigits: 'Telefon numarası sadece rakam içermelidir',
    phoneNotIdentical: 'Telefon numarası aynı rakamlardan oluşamaz',
    
    // Admin
    adminSettings: 'Yönetici Ayarları',
    adminPasswordPrompt: 'Wheel ayarlarını yapılandırmak için yönetici şifresini girin',
    adminPassword: 'Yönetici Şifresi',
    adminPasswordPlaceholder: 'Yönetici şifresini girin',
    login: 'Giriş',
    authenticating: 'Kimlik doğrulanıyor...',
    wheelConfiguration: 'Çark Yapılandırması',
    addSlice: 'Dilim Ekle',
    prizeName: 'Ödül Adı',
    weight: 'Ağırlık',
    saveConfiguration: 'Yapılandırmayı Kaydet',
    cancel: 'İptal',
    saving: 'Kaydediliyor...',
    
    // Results
    congratulations: 'Tebrikler!',
    youWon: 'Kazandınız:',
    awesome: 'Harika!',
    
    // Notifications
    loginSuccessful: 'Giriş Başarılı',
    welcomeAdmin: 'Hoş geldiniz, yönetici!',
    loginFailed: 'Giriş Başarısız',
    invalidPassword: 'Geçersiz şifre',
    configurationSaved: 'Yapılandırma Kaydedildi',
    wheelSettingsUpdated: 'Çark ayarları başarıyla güncellendi',
    saveFailed: 'Kaydetme Başarısız',
    configurationFailed: 'Yapılandırma kaydedilemedi',
    alreadyParticipated: 'Zaten Katıldınız',
    phoneAlreadyUsed: 'Bu telefon numarası zaten kullanılmış',
    spinFailed: 'Çevirme Başarısız',
    checkEligibilityFailed: 'Uygunluk kontrol edilemedi. Lütfen tekrar deneyin.',
    resultRecorded: 'Sonuç Kaydedildi',
    prizeRecorded: 'Ödülünüz kaydedildi!',
    recordingFailed: 'Kaydetme Başarısız',
    resultNotRecorded: 'Sonucunuz kaydedilemedi',
  },
  en: {
    // Header
    title: 'Spin the Wheel',
    subtitle: 'Enter your details and spin to win amazing prizes!',
    oneSpinPerPhone: 'One spin per phone number.',
    
    // Form
    enterDetails: 'Enter Your Details',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    phoneNumber: 'Phone Number',
    phoneNumberPlaceholder: 'Enter your phone number',
    spinButton: 'SPIN THE WHEEL!',
    checking: 'Checking',
    spinning: 'Spinning...',
    
    // Validation
    nameRequired: 'Name is required',
    nameMaxLength: 'Name must be less than 100 characters',
    phoneMinLength: 'Phone number must be at least 11 digits',
    phoneMaxLength: 'Phone number must be at most 15 digits',
    phoneOnlyDigits: 'Phone number must contain only digits',
    phoneNotIdentical: 'Phone number cannot have all identical digits',
    
    // Admin
    adminSettings: 'Admin Settings',
    adminPasswordPrompt: 'Enter admin password to configure wheel settings',
    adminPassword: 'Admin Password',
    adminPasswordPlaceholder: 'Enter admin password',
    login: 'Login',
    authenticating: 'Authenticating...',
    wheelConfiguration: 'Wheel Configuration',
    addSlice: 'Add Slice',
    prizeName: 'Prize Name',
    weight: 'Weight',
    saveConfiguration: 'Save Configuration',
    cancel: 'Cancel',
    saving: 'Saving...',
    
    // Results
    congratulations: 'Congratulations!',
    youWon: 'You won:',
    awesome: 'Awesome!',
    
    // Notifications
    loginSuccessful: 'Login Successful',
    welcomeAdmin: 'Welcome, admin!',
    loginFailed: 'Login Failed',
    invalidPassword: 'Invalid password',
    configurationSaved: 'Configuration Saved',
    wheelSettingsUpdated: 'Wheel settings updated successfully',
    saveFailed: 'Save Failed',
    configurationFailed: 'Failed to save configuration',
    alreadyParticipated: 'Already Participated',
    phoneAlreadyUsed: 'This phone number has already been used',
    spinFailed: 'Spin Failed',
    checkEligibilityFailed: 'Unable to check eligibility. Please try again.',
    resultRecorded: 'Result Recorded',
    prizeRecorded: 'Your prize has been recorded!',
    recordingFailed: 'Recording Failed',
    resultNotRecorded: 'Failed to record your result',
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
