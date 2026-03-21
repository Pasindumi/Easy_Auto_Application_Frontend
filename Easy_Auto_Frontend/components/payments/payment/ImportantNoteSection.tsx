import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    note: string;
}

const ImportantNoteSection: React.FC<Props> = ({ note }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconBox}>
                <Ionicons name="information-circle" size={20} color={COLORS.status.warning} />
            </View>
            <View style={styles.content}>
                <Text style={styles.header}>Important Note</Text>
                <Text style={styles.noteText}>{note}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        marginTop: 20, 
        backgroundColor: '#FFFBEB', 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: '#FEF3C7', 
        padding: 12,
        flexDirection: 'row',
        gap: 12,
    },
    iconBox: {
        marginTop: 2,
    },
    content: {
        flex: 1,
    },
    header: { 
        fontWeight: '700', 
        color: '#92400E', 
        fontSize: 13,
        marginBottom: 4,
    },
    noteText: { 
        color: '#B45309', 
        fontSize: 12,
        lineHeight: 18,
    },
});

export default ImportantNoteSection;
