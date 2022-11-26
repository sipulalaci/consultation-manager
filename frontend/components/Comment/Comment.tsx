import { Box, Divider, Paper, Typography } from "@mui/material";
import { format } from "date-fns";
import { useContext } from "react";
import { Context } from "../../contexts/UserContext";
import { Comment as CommentType } from "../../types/Comment";

interface Props {
  comment: CommentType;
}

export const Comment = ({ comment }: Props) => {
  const context = useContext(Context);
  return (
    <Paper key={comment.id} sx={{ padding: "1rem", marginBottom: "1rem" }}>
      <Box
        sx={{
          display: "flex",
          gap: ".5rem",
          ...(comment.userId === context?.user?.id
            ? {
                justifyContent: "flex-start",
                flexDirection: "row-reverse",
              }
            : {
                justifyContent: "flex-start",
              }),
        }}
      >
        <Typography fontWeight={600}>{comment.user.name}</Typography>
        <Typography>{` | `}</Typography>
        <Typography>
          {format(new Date(comment.createdAt), "yyyy.MM.dd - HH:mm")}
        </Typography>
      </Box>
      <Divider />
      <Typography>{comment.question}</Typography>
    </Paper>
  );
};
