import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase/Config';
import BookCard from '../components/BookCard';
import { Snackbar } from 'react-native-paper';

export default function BookshelfScreen()
{
    const [books, setBooks] = useState<any[]>([]);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const showToast = (msg: string) =>
    {
        setSnackbarMessage(msg);
        setSnackbarVisible(true);
    };

    const fetchBooks = async () =>
    {
        const querySnapshot = await getDocs(collection(firestore, 'Books'));
        const bookList: any[] = [];
        querySnapshot.forEach((d) =>
        {
            bookList.push({ id: d.id, ...d.data() });
        });
        setBooks(bookList);
    };

    const handleDelete = async (isbn: string) =>
    {
        await deleteDoc(doc(firestore, 'Books', isbn));
        fetchBooks();
        showToast('Book removed from bookshelf!');
    };

    useEffect(() => { fetchBooks(); }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Bookshelf</Text>
            <Text style={styles.count}>{`You have ${books.length} book${books.length !== 1 ? 's' : ''} in your bookshelf.`}</Text>
    
            <FlatList
                data={books}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <BookCard
                        book={{
                            id: item.id,
                            title: item.title,
                            author: item.author,
                            isbn: item.isbn,
                            cover: item.cover,
                        }}
                        onDelete={() => handleDelete(item.id)}
                    />
                )}
            />
    
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2500}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
    
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    header:
    {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    count: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
        textAlign: 'center',
    },    
});
