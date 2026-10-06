import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { getApiErrorMessage } from '@/services/api';
import { realizarTriagem } from '@/services/triageApi';
import { colors, spacing, typography } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';
import type { TriageAnswers, TriageResult } from '@/types/triage';

type Props = NativeStackScreenProps<RootStackParamList, 'Triage'>;
type AnswerKey = keyof TriageAnswers;
type PartialAnswers = Partial<Record<AnswerKey, boolean>>;

// As chaves abaixo são exatamente as mesmas esperadas pelo DTO do backend.
// Dessa forma, alterar uma pergunta exige uma mudança explícita no contrato.
const questions: { key: AnswerKey; text: string }[] = [
  { key: 'estaEmBoasCondicoesDeSaude', text: 'Você está em boas condições de saúde hoje?' },
  { key: 'pesaNoMinimo50Kg', text: 'Você pesa pelo menos 50 kg?' },
  { key: 'dormiuPeloMenosSeisHoras', text: 'Você dormiu pelo menos 6 horas nas últimas 24 horas?' },
  { key: 'estaAlimentado', text: 'Você está alimentado e evitou alimentos muito gordurosos?' },
  { key: 'consumiuAlcoolNasUltimas12Horas', text: 'Você consumiu bebida alcoólica nas últimas 12 horas?' },
  { key: 'possuiSintomasInfecciosos', text: 'Você está com febre, gripe ou outro sintoma infeccioso?' },
  { key: 'fezProcedimentoDeRiscoRecente', text: 'Você fez tatuagem, piercing ou outro procedimento de risco recentemente?' },
];

export function TriageScreen({ navigation, route }: Props) {
  const [answers, setAnswers] = useState<PartialAnswers>({});
  const [result, setResult] = useState<TriageResult | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const allQuestionsAnswered = useMemo(
    () => questions.every(({ key }) => typeof answers[key] === 'boolean'),
    [answers],
  );

  function answerQuestion(key: AnswerKey, value: boolean) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setError('');
  }

  async function submitTriage() {
    if (!allQuestionsAnswered) {
      setError('Responda todas as perguntas antes de continuar.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await realizarTriagem({
        doadorId: route.params.doadorId,
        respostas: answers as TriageAnswers,
      });

      setResult(response.resultado);
      setNotice(response.aviso);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Não foi possível concluir a triagem.'));
    } finally {
      setIsLoading(false);
    }
  }

  function restartTriage() {
    setAnswers({});
    setResult(null);
    setNotice('');
    setError('');
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScreenHeader onBack={() => navigation.goBack()} title="Triagem para doação" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {result ? (
          <View style={styles.resultContainer}>
            <View style={[styles.resultIcon, result.apto ? styles.successIcon : styles.warningIcon]}>
              <Ionicons
                color={colors.white}
                name={result.apto ? 'checkmark' : 'alert'}
                size={42}
              />
            </View>

            <Text style={[styles.resultTitle, result.apto ? styles.successText : styles.warningText]}>
              {result.apto
                ? 'Você está apto para a doação!'
                : 'Você não está apto para a doação.'}
            </Text>

            {result.apto ? (
              <Text style={styles.resultDescription}>
                Sua pré-triagem não identificou impedimentos. Você pode continuar o fluxo de agendamento.
              </Text>
            ) : (
              <View style={styles.criteriaCard}>
                <Text style={styles.criteriaTitle}>Critérios não atingidos:</Text>
                {result.motivosInaptidao.map((reason) => (
                  <View key={reason} style={styles.reasonRow}>
                    <Ionicons color={colors.primary[400]} name="close-circle" size={20} />
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.noticeCard}>
              <Ionicons color={colors.secondary[400]} name="information-circle" size={22} />
              <Text style={styles.noticeText}>{notice}</Text>
            </View>

            <PrimaryButton
              label={result.apto ? 'AGENDAR DOAÇÃO' : 'VOLTAR AO INÍCIO'}
              onPress={() => result.apto
                ? navigation.navigate('AppTabs', { screen: 'Schedule' })
                : navigation.navigate('AppTabs', { screen: 'Home' })}
            />
            <PrimaryButton label="REFAZER TRIAGEM" onPress={restartTriage} variant="light" />
          </View>
        ) : (
          <>
            <View style={styles.introCard}>
              <Ionicons color={colors.primary[400]} name="clipboard" size={30} />
              <View style={styles.introTextContainer}>
                <Text style={styles.introTitle}>Antes de doar</Text>
                <Text style={styles.introText}>
                  Responda com sinceridade. Esta avaliação é preliminar e não substitui a triagem clínica do hemocentro.
                </Text>
              </View>
            </View>

            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Questionário</Text>
              <Text style={styles.progressValue}>
                {Object.keys(answers).length}/{questions.length} respondidas
              </Text>
            </View>

            <View style={styles.questionsList}>
              {questions.map((question, index) => (
                <View key={question.key} style={styles.questionCard}>
                  <Text style={styles.questionNumber}>PERGUNTA {index + 1}</Text>
                  <Text style={styles.questionText}>{question.text}</Text>
                  <View style={styles.answerRow}>
                    {[true, false].map((value) => {
                      const selected = answers[question.key] === value;

                      return (
                        <Pressable
                          accessibilityRole="radio"
                          accessibilityState={{ checked: selected }}
                          key={String(value)}
                          onPress={() => answerQuestion(question.key, value)}
                          style={({ pressed }) => [
                            styles.answerButton,
                            selected && styles.answerButtonSelected,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Ionicons
                            color={selected ? colors.white : colors.text.muted}
                            name={value ? 'checkmark-circle-outline' : 'close-circle-outline'}
                            size={21}
                          />
                          <Text style={[styles.answerText, selected && styles.answerTextSelected]}>
                            {value ? 'Sim' : 'Não'}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>

            {error ? (
              <View style={styles.errorCard}>
                <Ionicons color={colors.primary[500]} name="alert-circle" size={20} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <PrimaryButton
              disabled={isLoading}
              label={isLoading ? 'ENVIANDO...' : 'VER RESULTADO'}
              onPress={submitTriage}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  answerButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1.5,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 46,
  },
  answerButtonSelected: {
    backgroundColor: colors.primary[400],
    borderColor: colors.primary[400],
  },
  answerRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  answerText: {
    color: colors.text.muted,
    fontSize: typography.size.md,
    fontWeight: '800',
  },
  answerTextSelected: {
    color: colors.white,
  },
  content: {
    gap: spacing.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  criteriaCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.softPrimary,
    borderRadius: 16,
    gap: spacing.md,
    padding: spacing.lg,
  },
  criteriaTitle: {
    color: colors.text.strong,
    fontSize: typography.size.lg,
    fontWeight: '900',
  },
  errorCard: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  errorText: {
    color: colors.primary[600],
    flex: 1,
    fontSize: typography.size.sm,
    fontWeight: '700',
  },
  introCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.softPrimary,
    borderRadius: 18,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  introText: {
    color: colors.text.muted,
    fontSize: typography.size.md,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  introTextContainer: {
    flex: 1,
  },
  introTitle: {
    color: colors.text.strong,
    fontSize: typography.size.lg,
    fontWeight: '900',
  },
  noticeCard: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: colors.secondary[100],
    borderRadius: 14,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  noticeText: {
    color: colors.secondary[500],
    flex: 1,
    fontSize: typography.size.sm,
    lineHeight: 19,
  },
  pressed: {
    opacity: 0.75,
  },
  progressLabel: {
    color: colors.text.strong,
    fontSize: typography.size.lg,
    fontWeight: '900',
  },
  progressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressValue: {
    color: colors.primary[400],
    fontSize: typography.size.sm,
    fontWeight: '800',
  },
  questionCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: spacing.md,
    padding: spacing.lg,
  },
  questionNumber: {
    color: colors.primary[400],
    fontSize: typography.size.tiny,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  questionText: {
    color: colors.text.strong,
    fontSize: typography.size.lg,
    fontWeight: '700',
    lineHeight: 23,
  },
  questionsList: {
    gap: spacing.md,
  },
  reasonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  reasonText: {
    color: colors.text.strong,
    flex: 1,
    fontSize: typography.size.md,
  },
  resultContainer: {
    alignItems: 'center',
    gap: spacing.xl,
    paddingTop: spacing.xl,
  },
  resultDescription: {
    color: colors.text.muted,
    fontSize: typography.size.lg,
    lineHeight: 24,
    textAlign: 'center',
  },
  resultIcon: {
    alignItems: 'center',
    borderRadius: 42,
    height: 84,
    justifyContent: 'center',
    width: 84,
  },
  resultTitle: {
    fontSize: typography.size.xxl,
    fontWeight: '900',
    lineHeight: 31,
    textAlign: 'center',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  successIcon: {
    backgroundColor: colors.success,
  },
  successText: {
    color: colors.success,
  },
  warningIcon: {
    backgroundColor: colors.primary[400],
  },
  warningText: {
    color: colors.primary[500],
  },
});
