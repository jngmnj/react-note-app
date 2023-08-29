import { createSlice } from '@reduxjs/toolkit';
import { Note } from '../../types/note';
import notes from '../../notesData';

interface NoteState {
  mainNotes: Note[],
  archiveNotes: Note[],
  trashNotes: Note[],
  editNote: null | Note
}

const initialState: NoteState = {
  mainNotes: [...notes],
  archiveNotes: [],
  trashNotes: [],
  editNote: null,
}

enum noteType {
  mainNotes = 'mainNotes',
  archiveNotes = 'archiveNotes',
  trashNotes = 'trashNotes'
}

const notesListSlice = createSlice({
  name: "notesList",
  initialState,
  reducers: {
    setMainNotes: (state, { payload }) => { // note생성이나 수정 후 업데이트
      // 해당 note edit
      if(state.mainNotes.find(({id}) => id === payload.id)) { // id가 payload로 들어오는 새로운 노트의 id가 같다면 수정하는데
        state.mainNotes = state.mainNotes.map((note) => 
          note.id === payload.id ? payload : note) // 같은건 변경해주고 원래있는건 원래있는걸로 넣어줌
      }
      // note를 새롭게 생성
      else {
        state.mainNotes.push(payload);
      }
    },
    setTrashNotes: (state, { payload }) => {
      state.mainNotes = state.mainNotes.filter(({id})=> id !== payload.id); // payload와 다른것만 넣어줌. 
      state.archiveNotes = state.archiveNotes.filter(({id})=> id !== payload.id); // payload와 다른것만 넣어줌. 
      state.trashNotes.push({...payload, isPinned: false}); // 다른 property override해서  ... 풀어서 넣어줌
    },
    setArchiveNotes: (state, { payload }) => {
      state.mainNotes = state.mainNotes.filter(({ id }) => id !== payload.id);
      state.archiveNotes.push({...payload, isPinned: false});
    },
    unArchiveNote: (state, { payload }) => {
      state.archiveNotes = state.archiveNotes.filter(({id})=> id !== payload.id);
      state.mainNotes.push(payload);
    },
    restoreNote: (state, { payload }) => {
      state.trashNotes = state.trashNotes.filter(({id}) => id !== payload.id);
      state.mainNotes.push(payload);
    },
    deleteNote: (state, { payload }) => {
      state.trashNotes = state.trashNotes.filter(({ id }) => id !== payload.id);

    },
    setPinnedNotes: (state, { payload }) => {
      state.mainNotes = state.mainNotes.map((note) => 
        note.id === payload.id ? {...note, isPinned: !note.isPinned} : note); // isPinned 값 toggle
    },
    setEditNote: (state, { payload }) => {
      state.editNote = payload;
    },
    readNote: (state, { payload }) => {
      const {type, id} = payload;
      const setRead = (notes: noteType) => {
        state[notes] = state[notes].map((note: Note) => 
        note.id === id ? {...note, isRead: !note.isRead} : note)
      }

      if(type === "archive") {
        setRead(noteType.archiveNotes);
      } else if(type === "trash") {
        setRead(noteType.trashNotes);
      } else { // main, tag... 
        setRead(noteType.mainNotes);
      }
    },
    removeTags: (state, { payload }) => {
      state.mainNotes = state.mainNotes.map((note) => ({
        ...note, // spread operate
        tags: note.tags.filter(({ tag }) => tag !== payload.tag), // payload에 같은 태그는 삭제하고 넣어준다
      }));
    },
  },
});

export const {
  setMainNotes,
  setArchiveNotes,
  setTrashNotes,
  unArchiveNote, 
  restoreNote, 
  deleteNote,
  setPinnedNotes,
  setEditNote,
  readNote,
  removeTags,
} = notesListSlice.actions;

export default notesListSlice.reducer