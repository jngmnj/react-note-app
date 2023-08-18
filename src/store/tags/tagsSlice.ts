import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

const initialState = {
  tagsList: [
    { tag: "learnings", id: v4() }, // v4: unique값 생성
    { tag: "work", id: v4() },
    { tag: "quotes", id: v4() },
  ],
}

const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {},
})

export default tagsSlice.reducer