import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { AccessibleText } from '../components/AccessibleText';
import { AccessibleButton } from '../components/AccessibleButton';
import { BackChevronIcon, MicIcon, PlayIcon } from '../components/icons';
import { createAnnouncement } from '../api/announcements';
import { useI18n } from '../i18n/I18nContext';
import type { Poi } from '../api/types';
import { colors, radii, spacing } from '../theme/theme';

type Props = {
  poi: Poi;
  onBack: () => void;
  onCreated: () => void;
};

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * This screen would normally be staff-only (the priest/parish office, not
 * every visitor) — there's no auth/role system yet to gate it behind, so
 * for the demo it's reachable from the Announcements screen for anyone.
 */
export function ComposeAnnouncementScreen({ poi, onBack, onCreated }: Props) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const player = useAudioPlayer(recordedUri ?? undefined);
  const playerStatus = useAudioPlayerStatus(player);

  async function startRecording() {
    setError(null);
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        setError(t('composeAnnouncement.micPermissionError'));
        return;
      }
      setRecordedUri(null);
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch {
      setError(t('composeAnnouncement.startRecordingError'));
    }
  }

  async function stopRecording() {
    await recorder.stop();
    setRecordedUri(recorder.uri);
  }

  function discardRecording() {
    setRecordedUri(null);
  }

  async function submit() {
    if (!title.trim()) {
      setError(t('composeAnnouncement.titleRequiredError'));
      return;
    }
    if (!body.trim() && !recordedUri) {
      setError(t('composeAnnouncement.contentRequiredError'));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createAnnouncement(poi.id, {
        title: title.trim(),
        body: body.trim() || undefined,
        audioUri: recordedUri ?? undefined,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('composeAnnouncement.genericError'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Pressable accessibilityRole="button" accessibilityLabel={t('common.back')} onPress={onBack} style={styles.iconButton}>
        <BackChevronIcon size={20} color={colors.text} />
      </Pressable>

      <View style={styles.titleBlock}>
        <AccessibleText variant="title">{t('composeAnnouncement.title')}</AccessibleText>
      </View>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder={t('composeAnnouncement.titlePlaceholder')}
        style={styles.titleInput}
      />

      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder={t('composeAnnouncement.bodyPlaceholder')}
        multiline
        style={styles.bodyInput}
      />

      <AccessibleText variant="caption" style={styles.sectionLabel}>
        {t('composeAnnouncement.voiceMessageLabel')}
      </AccessibleText>

      {recorderState.isRecording ? (
        <View style={styles.recordingRow}>
          <View style={styles.recordingDot} />
          <AccessibleText variant="bodyLarge" style={styles.recordingTime}>
            {formatDuration(recorderState.durationMillis)}
          </AccessibleText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('composeAnnouncement.stop')}
            onPress={stopRecording}
            style={styles.stopButton}
          >
            <AccessibleText variant="body" color="#FFFFFF" style={styles.pillLabel}>
              {t('composeAnnouncement.stop')}
            </AccessibleText>
          </Pressable>
        </View>
      ) : recordedUri ? (
        <View style={styles.recordedRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={playerStatus.playing ? t('composeAnnouncement.pausePreviewAria') : t('composeAnnouncement.playPreviewAria')}
            onPress={() => (playerStatus.playing ? player.pause() : player.play())}
            style={styles.playButton}
          >
            <PlayIcon size={18} color="#FFFFFF" />
          </Pressable>
          <AccessibleText variant="body" style={styles.recordedLabel}>
            {t('composeAnnouncement.recorded')}
          </AccessibleText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('composeAnnouncement.reRecordAria')}
            onPress={discardRecording}
            style={styles.discardButton}
          >
            <AccessibleText variant="caption" color={colors.danger}>
              {t('composeAnnouncement.reRecord')}
            </AccessibleText>
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('composeAnnouncement.recordAria')}
          onPress={startRecording}
          style={styles.recordButton}
        >
          <MicIcon size={20} color={colors.primary} />
          <AccessibleText variant="body" color={colors.primary} style={styles.pillLabel}>
            {t('composeAnnouncement.recordButton')}
          </AccessibleText>
        </Pressable>
      )}

      {error && (
        <AccessibleText variant="body" color={colors.danger}>
          {error}
        </AccessibleText>
      )}

      <View style={styles.spacer} />

      <AccessibleButton
        label={submitting ? t('composeAnnouncement.postingButton') : t('composeAnnouncement.postButton')}
        onPress={submit}
        disabled={submitting}
      />
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  titleInput: {
    minHeight: 56,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    fontSize: 20,
  },
  bodyInput: {
    minHeight: 100,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.md,
    fontSize: 18,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.xs,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 64,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  pillLabel: {
    fontWeight: '700',
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 64,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  recordingDot: {
    width: 14,
    height: 14,
    borderRadius: 9999,
    backgroundColor: colors.danger,
  },
  recordingTime: {
    flex: 1,
    fontVariant: ['tabular-nums'],
  },
  stopButton: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: 9999,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 64,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordedLabel: {
    flex: 1,
  },
  discardButton: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    minHeight: spacing.md,
  },
});
