import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccessibleButton } from '../components/AccessibleButton';
import { AccessibleText } from '../components/AccessibleText';
import { Avatar } from '../components/Avatar';
import { CameraIcon, CloseIcon } from '../components/icons';
import { updateMyProfile, uploadMyAvatar } from '../api/auth';
import { useAuth } from '../auth/AuthContext';
import { cardSurface, colors, fontSizes, minTouchTarget, radii, spacing } from '../theme/theme';
import { useI18n } from '../i18n/I18nContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  // Signing in is a screen of its own, so the settings menu hands that
  // over rather than growing a second login form.
  onSignIn: () => void;
};

/**
 * What the profile circle in the hub's top bar opens: the two things
 * somebody can change about themselves today, a picture and a name, and
 * the way out of their session.
 *
 * A full-height sheet rather than a small one to drag up — every row is a
 * full-width target and the fields are the same size as everywhere else
 * in the app.
 */
export function ProfileScreen({ visible, onClose, onSignIn }: Props) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { me, applyMe, signOut } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [busy, setBusy] = useState<'name' | 'picture' | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Reopening starts from whatever the session says, so an abandoned edit
  // is never waiting there the next time.
  useEffect(() => {
    if (!visible) return;
    setFirstName(me?.firstName ?? '');
    setLastName(me?.lastName ?? '');
    setBusy(null);
    setSaved(false);
    setError(null);
    setPickerOpen(false);
  }, [visible, me]);

  const nameChanged =
    firstName.trim() !== (me?.firstName ?? '') || lastName.trim() !== (me?.lastName ?? '');

  async function saveName() {
    setBusy('name');
    setError(null);
    try {
      applyMe(await updateMyProfile({ firstName: firstName.trim(), lastName: lastName.trim() }));
      setSaved(true);
    } catch {
      setError(t('profile.error'));
    } finally {
      setBusy(null);
    }
  }

  async function pickPicture(source: 'library' | 'camera') {
    setPickerOpen(false);
    setError(null);

    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError(t('profile.permissionDenied'));
      return;
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      // The picture is only ever shown in a circle, so it is cropped to a
      // square here rather than centre-cropped on the fly everywhere it
      // appears. Quality is dropped too: nothing is displayed above 64pt.
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    };
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

    const picked = result.canceled ? undefined : result.assets[0];
    if (!picked) return;

    setBusy('picture');
    try {
      applyMe(await uploadMyAvatar(picked.uri));
      setSaved(true);
    } catch {
      setError(t('profile.error'));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.titleRow}>
          <AccessibleText variant="title" style={styles.title}>
            {t('profile.title')}
          </AccessibleText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('places.close')}
            onPress={onClose}
            style={styles.closeButton}
          >
            <CloseIcon size={24} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + spacing.xl },
          ]}
        >
          {!me ? (
            <View style={styles.card}>
              <AccessibleText variant="body">{t('profile.signedOutExplainer')}</AccessibleText>
              <AccessibleButton
                label={t('home.signInButton')}
                onPress={() => {
                  onClose();
                  onSignIn();
                }}
              />
            </View>
          ) : (
            <>
              <View style={styles.card}>
                <AccessibleText variant="caption" color={colors.textMuted}>
                  {t('profile.pictureLabel')}
                </AccessibleText>
                <View style={styles.pictureRow}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      me.avatarUrl ? t('profile.changePicture') : t('profile.addPicture')
                    }
                    onPress={() => setPickerOpen(true)}
                    disabled={busy !== null}
                    style={styles.pictureTarget}
                  >
                    <Avatar me={me} size={96} />
                    <View style={styles.pictureBadge}>
                      <CameraIcon size={20} color={colors.primaryText} />
                    </View>
                  </Pressable>

                  <View style={styles.pictureActions}>
                    {busy === 'picture' ? (
                      <View style={styles.busyRow}>
                        <ActivityIndicator color={colors.primaryStrong} />
                        <AccessibleText variant="body" color={colors.textMuted}>
                          {t('profile.saving')}
                        </AccessibleText>
                      </View>
                    ) : (
                      <AccessibleButton
                        label={me.avatarUrl ? t('profile.changePicture') : t('profile.addPicture')}
                        variant="secondary"
                        onPress={() => setPickerOpen(true)}
                      />
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.card}>
                <AccessibleText variant="caption" color={colors.textMuted}>
                  {t('profile.firstNameLabel')}
                </AccessibleText>
                <TextInput
                  value={firstName}
                  onChangeText={(value) => {
                    setFirstName(value);
                    setSaved(false);
                  }}
                  style={styles.input}
                  accessibilityLabel={t('profile.firstNameLabel')}
                  autoCapitalize="words"
                  returnKeyType="next"
                />

                <AccessibleText variant="caption" color={colors.textMuted}>
                  {t('profile.lastNameLabel')}
                </AccessibleText>
                <TextInput
                  value={lastName}
                  onChangeText={(value) => {
                    setLastName(value);
                    setSaved(false);
                  }}
                  style={styles.input}
                  accessibilityLabel={t('profile.lastNameLabel')}
                  autoCapitalize="words"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    if (nameChanged) void saveName();
                  }}
                />

                {/* Coral only once there is something to save. A greyed
                    coral fill with white text on it is unreadable, so
                    nothing-to-save takes the plain outlined look
                    instead. */}
                <AccessibleButton
                  label={busy === 'name' ? t('profile.saving') : t('profile.save')}
                  variant={nameChanged ? 'primary' : 'secondary'}
                  onPress={() => void saveName()}
                  disabled={busy !== null || !nameChanged}
                />
              </View>

              {error && (
                <AccessibleText variant="body" color={colors.danger}>
                  {error}
                </AccessibleText>
              )}
              {saved && !error && (
                <AccessibleText variant="body" color={colors.primaryStrong}>
                  {t('profile.saved')}
                </AccessibleText>
              )}

              <AccessibleText variant="caption" color={colors.textMuted} style={styles.laterNote}>
                {t('profile.laterLabel')}
              </AccessibleText>

              <AccessibleButton
                label={t('home.signOutButton')}
                variant="secondary"
                onPress={() => {
                  onClose();
                  void signOut();
                }}
              />
            </>
          )}
        </ScrollView>

        {/* Where the picture comes from, asked as two big buttons rather
            than a system action sheet, which is small and easy to miss. */}
        <Modal
          visible={pickerOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setPickerOpen(false)}
        >
          <Pressable
            style={styles.scrim}
            onPress={() => setPickerOpen(false)}
            accessibilityLabel={t('profile.cancel')}
          />
          <View style={[styles.pickerSheet, { paddingBottom: insets.bottom + spacing.lg }]}>
            <AccessibleButton
              label={t('profile.choosePhoto')}
              onPress={() => void pickPicture('library')}
            />
            <AccessibleButton
              label={t('profile.takePhoto')}
              variant="secondary"
              onPress={() => void pickPicture('camera')}
            />
            <AccessibleButton
              label={t('profile.cancel')}
              variant="secondary"
              onPress={() => setPickerOpen(false)}
            />
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardSurface,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  card: {
    ...cardSurface,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  pictureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pictureTarget: {
    // The circle is the other way to change the picture, so it carries
    // the camera badge that says so.
    position: 'relative',
  },
  pictureBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pictureActions: {
    flex: 1,
  },
  busyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    minHeight: minTouchTarget,
    fontSize: fontSizes.body,
    color: colors.text,
    paddingHorizontal: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.background,
  },
  laterNote: {
    paddingHorizontal: spacing.xs,
  },
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(17,17,17,0.45)',
  },
  pickerSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
});
