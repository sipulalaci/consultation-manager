import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { getCommentsByUser } from "../../api/api";
import { Context } from "../../contexts/UserContext";
import { Schedule } from "../../types/Schedule";
import { Comment } from "../Comment/Comment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const QAndAs = () => {
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);
  const context = useContext(Context);

  useEffect(() => {
    if (!context || !context.user) return;

    getCommentsByUser(context.user.id)
      .then((response) => {
        setSchedules(response);
      })
      .catch((e) => {
        toast.error(
          (e as AxiosError<{ statusCode: number; message: string }>).response
            ?.data?.message
        );
      });
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" color="inherit" component="div">
        Questions and answers
      </Typography>
      <Divider sx={{ my: 2 }} />
      {schedules && !!schedules.length ? (
        schedules.map((schedule) => (
          <Accordion sx={{ background: "#dcdcdc" }} key={schedule.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel1a-header"
            >
              <Typography>{schedule.description}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack>
                {schedule.comments.map((comment) => (
                  <Comment comment={comment} key={comment.id} />
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <>
          <Typography>There are no comments.</Typography>
        </>
      )}
    </Box>
  );
};
