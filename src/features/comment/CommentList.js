import React, { useEffect } from "react";

import { Pagination, Stack, Typography,Button,Modal,Box,Avatar,TextField } from "@mui/material";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { EditComment, getComments, RepairComment } from "./commentSlice";
import CommentCard from "./CommentCard";
import LoadingScreen from "../../components/LoadingScreen";
import { COMMENTS_PER_POST } from "../../app/config";
import useAuth from "../../hooks/useAuth";


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

function CommentList({ postId, userId }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [openRepair , setOpenRepair ] = React.useState(false);
  const [openEdit , setOpenEdit ] = React.useState(false);
  const [commentId, setCommentId] = React.useState("");
  const [content, setContent] = React.useState("");

  const handleOpenRepair  = (id) => {
    setOpenRepair (true)
    setCommentId(id)
  };
  const handleRepair = (commentId) =>{
    setOpenRepair (false)
    dispatch(RepairComment({ postId ,commentId}))
  };
  const handleCloseRepair = () => {
    setOpenRepair (false)
    setCommentId("")
  };

  const handleOpenEdit = (id,content) =>{
    setOpenEdit (true)
    setCommentId(id)
    setContent(content)
  };
  const handleCloseEdit = () => {
    setOpenEdit(false)
    setCommentId("")
  };
  const handleEdit = () => {
    setOpenEdit(false);
    dispatch(EditComment({ postId,commentId,content}))
  }
  


  const {
    commentsByPost,
    commentsById,
    totalComments,
    isLoading,
    currentPage,
  } = useSelector(
    (state) => ({
      commentsByPost: state.comment.commentsByPost[postId],
      totalComments: state.comment.totalCommentsByPost[postId],
      currentPage: state.comment.currentPageByPost[postId] || 1,
      commentsById: state.comment.commentsById,
      isLoading: state.comment.isLoading,
    }),
    shallowEqual
  );
  const totalPages = Math.ceil(totalComments / COMMENTS_PER_POST);

  useEffect(() => {
    if (postId) dispatch(getComments({ postId }));
  }, [postId, dispatch]);

  let renderComments;

  if (commentsByPost) {
    const comments = commentsByPost.map((commentId) => commentsById[commentId]);
    renderComments = (
      <Stack spacing={1.5}>
        {comments.map((comment) => (
          <CommentCard key={comment._id} comment={comment} handleOpenRepair ={handleOpenRepair} handleOpenEdit={handleOpenEdit} />
        ))}
      </Stack>
    );
  } else if (isLoading) {
    renderComments = <LoadingScreen />;
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle" sx={{ color: "text.secondary" }}>
          {totalComments > 1
            ? `${totalComments} comments`
            : totalComments === 1
            ? `${totalComments} comment`
            : "No comment"}
        </Typography>
        {totalComments > COMMENTS_PER_POST && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => dispatch(getComments({ postId, page }))}
          />
        )}
      </Stack>
      {renderComments}
      <Modal
            open={openRepair}
            onClose={handleCloseRepair}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Button onClick={() =>handleRepair(commentId)}>Yes</Button>

              <Button onClick={() =>handleCloseRepair()}>No</Button>
            </Box>
          </Modal>
          <Modal
            open={openEdit}
            onClose={handleCloseEdit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
            <Stack direction="row" alignItems="center">
        <Avatar src={user.avatarUrl} alt={user.name} />
        <TextField
          fullWidth
          size="small"
          value={content}
          placeholder="Write a comment…"
          onChange={(event) => setContent(event.target.value)}
          sx={{
            ml: 2,
            mr: 1,
            "& fieldset": {
              borderWidth: `1px !important`,
              borderColor: (theme) =>
                `${theme.palette.grey[500_32]} !important`,
            },
          }}
        />
      </Stack>
              <Button onClick={() =>handleEdit(commentId,content)}>Yes</Button>
              <Button onClick={() =>handleCloseEdit()}>No</Button>
            </Box>
          </Modal>
    </Stack>
  );
}

export default CommentList;
