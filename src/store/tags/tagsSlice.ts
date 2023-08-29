import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';

const initialState = {
  tagsList: [
    { tag: "coding", id: v4() }, // v4: unique값 생성
    { tag: "exercise", id: v4() },
    { tag: "quotes", id: v4() },
  ],
}

const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
      addTags: (state, { payload }) => {
        if(state.tagsList.find(({tag}) => tag === payload.tag)) { // 있는 태그는 추가하지않고 이미있다는 알림 
          toast.warning("이미 존재하는 태그입니다. ");
        } else {
          state.tagsList.push(payload); // 내부에서 immer라는 모듈로 처리되기때문에 불변성안지키면서 push 할수있음
          toast.info("새로운 태그가 등록되었습니다.");
        }
      },
      deleteTags: (state, { payload }) => {
        state.tagsList = state.tagsList.filter(({id}) => id !== payload); //같지 않은것만 넣어줌. 즉, 같은건 지워짐
        toast.info("태그가 삭제되었습니다.");
      }
    },
})

export const { addTags, deleteTags } = tagsSlice.actions;

export default tagsSlice.reducer;