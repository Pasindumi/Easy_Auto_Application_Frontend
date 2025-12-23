import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    note: string;
}

const ImportantNoteSection: React.FC<Props> = ({ note }) => {
    return (
        <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>Important Note</Text>
            <Text style={styles.noteText}>{note}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionBox: { marginTop: 12, backgroundColor: '#f3f4ff', borderRadius: 10, borderWidth: 1, borderColor: '#e0e7ff', padding: 12 },
    sectionHeader: { fontWeight: '700', color: '#1f2937', marginBottom: 8 },
    noteText: { color: '#6b7280', fontSize: 12 },
});

export default ImportantNoteSection;
