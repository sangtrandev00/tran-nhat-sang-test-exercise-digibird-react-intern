import { atom, selector } from "recoil";
import { Post } from "../types/Post";
  

export const postListState = atom<Post[]>({
    key: 'posts',
    default: [],
})

export const editingPostIdState = atom<string>({
  key: "editingPostId",
  default: ""
})

export const editingPostState = atom<Post>({
  key: "editingPost",
  default: {
    title: "",
    description: "",
    publishDate: "",
    id: "",
    featuredImage: "",
    published: false
  }
})
  
  // export const selectedIndustryIdState = atom({
  //   key: 'selectedIndustryId',
  //   default: null,
  // });


  // // selectors
  // export const selectedIndustrySelector = selector({
  //   key: 'selectedIndustry',
  //   get: ({get}) => {
  //     const industries = get(postListState);
  //     const selectedIndustryId = get(selectedIndustryIdState);
  //     return industries.find(industry => industry.id === selectedIndustryId);
  //   }
  // })

  
export const CurrentPostIdState = atom({
    key: 'CurrentPostId',
    default: 1,
});

  // Define an atom for Post
export const postState = atom({
  key: 'postState',
  default: { id: 1, title: '', body: '', userId: 2 },
});

export const getPostList = selector<Post[]>({
  key: 'getPostList',
  get: ({get}) => {
    const postList = get(postListState);
    return postList;
  }
})


  // Async Selectors
export const getPostListAsync = selector<Post[]>({
    key: 'postListAsync',
    get: async () => {
      const response = await fetch('http://localhost:4000/posts');
      return response.json();
    }
})


// export const currentPostState = selector({
//     key: "currentPostState",
//     get: async ({get}) => {
//       const postId = get(CurrentPostIdState);
//       const postList = get(getPostListAsync);
//       const currentPost = postList.find(post => post.id === postId);
//       return currentPost
//     }
// })

// export const addPostSelector = selector({
//   key: 'addPost',
//   get: async ({ get }) => {
//     const response = await fetch('http://localhost:4000/posts');
//     const data = await response.json();
//     return data;
//   },
//   set: ({ set }, newValue) => {
//       // Initiate the asynchronous operation to update the user's profile on the server.
//     // Do not update the selector state here.

//     // After the operation succeeds, trigger a reevaluation of the selector.
//     fetch('http://localhost:4000/posts', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newValue),
//     }).then( (res) => {
      
//       return res.json();

//     }).then((data) => {
//       console.log("res data ", data);
//       set(postListState, data); 
//     })
//     .catch(error => {
//       console.error('Error updating add post:', error);
//     });
//   },
// });

export const getPostByIdAsync = selector<Post>({
    key: 'getPostByIdAsync',
    get: async ({get}) => {

      const postId = get(CurrentPostIdState);
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      return response.json();
    }
})