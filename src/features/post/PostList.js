import { LoadingButton } from "@mui/lab";
import React, { useEffect, useState} from "react";
import { Box, Typography,Modal,Button,Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "./PostCard";
import { getPosts, RepairPost } from "./postSlice";
import PostEditForm from "../post/PostEditForm";



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function PostList({ userId }) {
 
  const [page, setPage] = useState(1);
  const { currentPagePosts, postsById, isLoading, totalPosts } = useSelector(
    (state) => state.post
  );
  const posts = currentPagePosts.map((postId) => postsById[postId]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userId) dispatch(getPosts({ userId, page }));
  }, [dispatch, userId, page]);

  const [openRepair, setOpenRepair] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [postId, setPostId] = useState("");
  const handleOpenRepair = (id) => {
    setOpenRepair(true)
    setPostId(id)
  };
  
  const handleRepair = (id) =>{
    setOpenRepair(false)
    dispatch(RepairPost({id}))
  };

  const handleCloseRepair = () => {
    setOpenRepair(false)
    setPostId("")
  };

  const handleOpenEdit = (id) => {
    setOpenEdit(true)
    setPostId(id)
  };
  const handleCloseEdit = () =>{
    setOpenEdit(false)
    setPostId("")
  };

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} handleOpen={handleOpenRepair} handleOpenEdit={handleOpenEdit} />
      ))}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {totalPosts ? (
          <LoadingButton
            variant="outlined"
            size="small"
            loading={isLoading}
            onClick={() => setPage((page) => page + 1)}
            disabled={Boolean(totalPosts) && posts.length >= totalPosts}
          >
            Load more
          </LoadingButton>
        ) : (
          <Typography variant="h6">No Post Yet</Typography>
        )}
      </Box>
          <Modal
            open={openRepair}
            onClose={handleCloseRepair}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Button onClick={() =>handleRepair(postId)}>Yes</Button>

              <Button onClick={() =>handleCloseRepair()}>No</Button>
            </Box>
          </Modal>
          
          <Modal
            open={openEdit}
            onClose={handleCloseEdit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >   
            <Stack spacing={3}>
            
          <PostEditForm handleCloseEdit={handleCloseEdit} postId={postId} />
          <Button onClick={() =>handleCloseEdit()}>No</Button>
        </Stack>
          </Modal>
          
    </>
  );
}

export default PostList;
