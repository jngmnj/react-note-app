import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { DeleteBox, FixedContainer } from "../Modal.styles";
import { AddedTagsBox, Box, OptionsBox, StyledInput, TopBox } from "./CreateNoteModal.styles";
import { toggleCreateNoteModal, toggleTagsModal } from "../../../store/modal/modalSlice";
import { setEditNote, setMainNotes } from "../../../store/notesList/notesListSlice";
import { ButtonFill, ButtonOutline } from "../../../styles/styles";
import { FaPlus, FaTimes } from "react-icons/fa";
import TagsModal from "../TagsModal/TagsModal";
import { v4 } from "uuid";
import { TextEditor } from "../..";
import { toast } from 'react-toastify';
import dayjs from "dayjs";
import { Note } from './../../../types/note';

const CreateNoteModal = () => {
  const dispatch = useAppDispatch();
  const { editNote } = useAppSelector((state) => state.notesList);
  const { viewAddTagsModal } = useAppSelector((state) => state.modal);

  const [noteTitle, setNoteTitle] = useState(editNote?.title || "");
  const [value, setValue] = useState(editNote?.content || "");
  const [addedTags, setAddedTags] = useState(editNote?.tags || []);
  const [noteColor, setNoteColor] = useState(editNote?.color || "");
  const [priority, setPriority] = useState(editNote?.priority || "low");

  const closeCreateNoteModal = () => {
    dispatch(toggleCreateNoteModal(false));
    dispatch(setEditNote(null));
  };

  const tagsHandler = (tag: string, type: string) => {
    // tag add, delete 기능
    const newTag = tag.toLowerCase();
    if(type === 'add') {
      setAddedTags((prev) => [...prev, {tag: newTag, id: v4()}])
      console.log("여기2");
    } else {
      setAddedTags(addedTags.filter(({tag}) => tag !== newTag));
      console.log("여기")
    }
  };
  
  const createNoteHanlder = () => {
    // 유효성검사
    if(!noteTitle) {
      toast.error('타이틀을 작성해주세요.');
      return;
    } else if(value === "<p><br/></p>") {
      toast.error('내용을 작성해주세요.');
    }

    const date = dayjs().format("DD/MM/YYYY h:mm A");

    let note: Partial<Note> = {
      title: noteTitle,
      content: value, 
      tags: addedTags,
      color: noteColor,
      priority,
      editedTime: new Date().getTime()
    }

    if(editNote) { // 수정중
      note = { ...editNote, ...note }
    } else {
      note = {
        ...note,
        date,
        createdTime: new Date().getTime(),
        editedTime: null,
        isPinned: false,
        isRead: false,
        id: v4()
      }
    }

    dispatch(setMainNotes(note));
    dispatch(toggleCreateNoteModal(false));
    dispatch(setEditNote(null));

  };

  return (
    <FixedContainer>
      {viewAddTagsModal && (
        <TagsModal type="add" addedTags={addedTags} handleTags={tagsHandler} />
      )}

      <Box>
        <TopBox>
          <div className="createNote__title">
            {editNote ? "노트 수정하기" : "노트 생성하기"}
          </div>
          <DeleteBox
            className="createNote__close-btn"
            onClick={closeCreateNoteModal}
          >
            <FaTimes />
          </DeleteBox>
        </TopBox>
        <StyledInput
          type="text"
          value={noteTitle}
          name="title"
          placeholder="제목..."
          onChange={(e) => setNoteTitle(e.target.value)}
        />
        <TextEditor color={noteColor} value={value} setValue={setValue} />

        <AddedTagsBox>
          {addedTags.map(({ tag, id }) => (
            <div key={id}>
              <span className="createNote__Tag">{tag}</span>
              <span
                className="createNote__tag-remove"
                onClick={() => tagsHandler(tag, "remove")}
              >
                <FaTimes />
              </span>
            </div>
          ))}
        </AddedTagsBox>
        <OptionsBox>
          <ButtonOutline
            onClick={() =>
              dispatch(toggleTagsModal({ type: "add", view: "true" }))
            }
          >
            Add Tag
          </ButtonOutline>
          <div>
            <label>배경색 : </label>
            <select
              value={noteColor}
              id="color"
              onChange={(e) => setNoteColor(e.target.value)}
            >
              <option value="">White</option>
              <option value="#ffcccc">Red</option>
              <option value="#ccffcc">Green</option>
              <option value="#cce0ff">Blue</option>
              <option value="#ffffcc">Yellow</option>
            </select>
          </div>
          <div>
            <label>우선순위 : </label>
            <select
              value={priority}
              id="priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </div>
        </OptionsBox>
        <div className="createNote__create-btn">
          <ButtonFill onClick={createNoteHanlder}>
            {editNote ? (
              <span>저장하기</span>
            ) : (
              <>
                <FaPlus />
                <span>생성하기</span>
              </>
            )}
          </ButtonFill>
        </div>
      </Box>
    </FixedContainer>
  );
};

export default CreateNoteModal;
