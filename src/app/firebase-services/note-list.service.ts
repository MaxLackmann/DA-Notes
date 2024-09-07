import { inject, Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { query, where, orderBy, limit, Firestore, collection, doc, onSnapshot, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;
  
  firestore: Firestore = inject(Firestore);
  normalMarkedNotes: Note[] = [];

  constructor() {
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNoteslList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
  }

  async deleteNote(colId: "notes" | "trash", docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => {console.error(err); }
    )
  }

  async updateNote(note: Note) {
    if(note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note),note.id);
      await updateDoc(docRef,this.getCleanJson(note)).catch(
        (err) => {console.error(err); }
      )
    }
  }

  getCleanJson(note: Note):{} {
    return {
      type: note.type,
      title: note.title,
      description: note.description,
      marked: note.marked,
    }
  }
  getColIdFromNote(note: Note) {
    if(note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async addNote(item: Note, colId: 'notes' | 'trash') {
    if (colId == 'notes') {
      await addDoc(this.getNotesRef(), item)
        .catch((err) => {
          console.error(err);
        })
        .then((docRef) => {
          console.log('Document written with ID: ', docRef);
        });
    } else {
      await addDoc(this.getTrashRef(), item);
    }
  }

  ngonDestroy() {
    this.unsubTrash();
    this.unsubNotes();
    this.unsubMarkedNotes();
  }

  subTrashList() {
   return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNoteslList() {
    const q = query(this.getNotesRef(), limit(100));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subMarkedNotesList() {
    const q = query(
      this.getNotesRef(),
      where('marked', '==', true),
      limit(100)
    );
    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach((element) => {
        this.normalMarkedNotes.push(
          this.setNoteObject(element.data(), element.id)
        );
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || '',
      type: obj.type || "note",
      title: obj.title || '',
      description: obj.description || '',
      marked: obj.marked || false,
    }
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }
  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId),docId);
  }

}