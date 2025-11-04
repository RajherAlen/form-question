// components/FormPDF.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { getOptionLabel, getQuestionLabel } from '../lib/formUtils';

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 11, fontFamily: 'Helvetica' },
    header: { fontSize: 16, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    section: { flex: 1 },
    wrapper: { display: 'flex', flexDirection: 'row', gap: 20, borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 20 },
    label: { marginBottom: 4, fontSize: 9, color: '#333' },
    text: { marginBottom: 12, fontSize: 10, textTransform: 'capitalize' },
    questionBlock: { marginBottom: 16 },
    question: { fontSize: 9, marginBottom: 4, color: '#333' },
    answer: {
        marginLeft: 14, fontSize: 10, textTransform: 'capitalize',
    },
});

export const FormPDF = ({ data }: { data: Record<string, any> }) => {
    const { clientName, clientId, status, updated_at, ...responses } = data;

    const questions = Object.entries(responses)
        .filter(([key]) => /^\d+$/.test(key))
        .sort((a, b) => Number(a[0]) - Number(b[0]));

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Form Summary</Text>

                <View style={styles.wrapper}>
                    <View style={styles.section}>
                        <Text style={styles.label}>Client Name:</Text>
                        <Text style={styles.text}>{clientName}</Text>
                        <Text style={styles.label}>Client ID:</Text>
                        <Text style={styles.text}>{clientId}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={styles.text}>{status}</Text>
                        <Text style={styles.label}>Last Updated:</Text>
                        <Text style={styles.text}>{new Date(updated_at).toLocaleString()}</Text>
                    </View>
                </View>

                {questions.map(([key, value], index) => {
                    const qLabel = getQuestionLabel(key);
                    const readableValue = getOptionLabel(key, value);
                    return (
                        <View key={key} style={styles.questionBlock}>
                            <Text style={styles.question}>{index + 1}. {qLabel}</Text>
                            <Text style={styles.answer}>{readableValue || '-'}</Text>
                        </View>
                    );
                })}
            </Page>
        </Document>
    );
};
