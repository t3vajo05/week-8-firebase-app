import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

interface BookData
{
    title?: string;
    subtitle?: string;
    publish_date?: string;
    number_of_pages?: number;
    publishers?: string[];
    subjects?: string[];
    isbn_13?: string[];
}

interface Props
{
    bookData: BookData;
    authorName: string | null;
}

export default function BookInfo({ bookData, authorName }: Props)
{
    return (
        <View style={styles.infoContainer}>
            {bookData.isbn_13 && (
                <Image
                    source={{
                        uri: `https://covers.openlibrary.org/b/isbn/${bookData.isbn_13[0]}-L.jpg`,
                    }}
                    style={styles.cover}
                />
            )}

            <Text style={styles.bookTitle}>{bookData.title}</Text>
            {bookData.subtitle && <Text style={styles.subtitle}>{bookData.subtitle}</Text>}

            {authorName && <Text style={styles.author}>by {authorName}</Text>}

            <Text style={styles.detail}>📅 Published: {bookData.publish_date}</Text>
            <Text style={styles.detail}>🏢 Publisher: {bookData.publishers?.join(', ')}</Text>
            <Text style={styles.detail}>📄 Pages: {bookData.number_of_pages}</Text>

            {bookData.subjects && (
                <Text style={styles.detail}>
                    📚 Subjects: {bookData.subjects.slice(0, 5).join(', ')}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    infoContainer:
    {
        marginTop: 20,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    bookTitle:
    {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    subtitle:
    {
        fontSize: 16,
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#555',
        marginBottom: 10,
    },
    author:
    {
        fontSize: 16,
        marginVertical: 5,
        color: '#333',
    },
    cover:
    {
        width: 150,
        height: 220,
        resizeMode: 'cover',
        borderRadius: 8,
        marginBottom: 10,
    },
    detail:
    {
        fontSize: 14,
        color: '#444',
        marginTop: 4,
        textAlign: 'center',
    },
});
