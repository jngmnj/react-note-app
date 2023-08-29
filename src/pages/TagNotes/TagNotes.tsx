import React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { Container, EmptyMsgBox } from '../../styles/styles';
import { useParams } from 'react-router-dom';
import { Note } from '../../types/note';
import { MainWrapper } from '../../components';

const TagNotes = () => {
  const { name } = useParams() as {name: string}; // App.tsx에서 지정한 route에 parameter 이름을 name으로 지정함
  const { mainNotes } = useAppSelector((state) => state.notesList);

  let notes: Note[] = [];
  mainNotes.forEach((note) => {
    if(note.tags.find(({tag}) => tag === name)) {
      notes.push(note);
    }
  })
  return (
    <Container>
      {notes.length === 0 ? (
        <EmptyMsgBox>노트가 없습니다.</EmptyMsgBox>
      ) : (
        <MainWrapper 
          notes={notes}
          type={name}
        />
      )}
    </Container>
  )
}

export default TagNotes