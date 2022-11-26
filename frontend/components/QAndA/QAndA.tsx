import {
  Box,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Comment } from "../../types/Comment";
import { Comment as CommentComponent } from "../Comment/Comment";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
  comments: Comment[];
  scheduleId: string;
  onCommentCreate: (text: string) => void;
}

export const QAndA = ({ comments, scheduleId, onCommentCreate }: Props) => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentText, setCommentText] = useState("");

  return (
    <>
      <Typography fontWeight={600}>Q&A</Typography>
      {comments.length ? (
        <Stack>
          {comments.map((comment) => (
            <CommentComponent comment={comment} key={comment.id} />
          ))}
        </Stack>
      ) : (
        <Typography>There are no questions.</Typography>
      )}
      <Collapse in={isAddingComment}>
        <Box sx={{ display: "flex" }}>
          <TextField
            label="Text"
            name="text"
            variant="outlined"
            multiline
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            sx={{ width: "100%" }}
          />
          <IconButton
            aria-label="add"
            onClick={() => {
              if (commentText !== "") {
                onCommentCreate(commentText);
                setCommentText("");
                setIsAddingComment(false);
              }
            }}
            color="success"
            sx={{ width: "3.5rem", height: "3.5rem" }}
            disabled={commentText === ""}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            aria-label="add"
            onClick={() => {
              setIsAddingComment(false);
              setCommentText("");
            }}
            color="warning"
            sx={{ width: "3.5rem", height: "3.5rem" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Collapse>
      <Collapse in={!isAddingComment}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="add"
            size="large"
            onClick={() => {
              setIsAddingComment(true);
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Collapse>
    </>
  );
};
