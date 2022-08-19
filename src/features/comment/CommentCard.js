import React from "react";
import { Avatar, Box, Paper, Stack, Typography, Button } from "@mui/material";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import useAuth from "../../hooks/useAuth";

function CommentCard({ comment,handleOpenRepair, handleOpenEdit }) {
  const { user } = useAuth();


  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {fDate(comment.createdAt)}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {comment.content}
        </Typography>
        {user._id === comment.author?._id &&
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={() =>handleOpenRepair(comment._id)}>xóa</Button>
          <Button onClick={() =>handleOpenEdit(comment._id,comment.content)}>sữa</Button>
        </Box>}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CommentReaction comment={comment} />
        </Box>
      </Paper>
    </Stack>
  );
}

export default CommentCard;
