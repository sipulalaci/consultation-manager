import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { addMinutes, format } from "date-fns";

const consultationsByDate = {
  "2021-09-01": [
    {
      id: 1,
      date: "2021-09-01T00:00:00.000Z",
      teacherId: 1,
    },
    {
      id: 2,
      date: "2021-09-01T00:15:00.000Z",
      teacherId: 1,
    },
    {
      id: 3,
      date: "2021-09-01T00:45:00.000Z",
      teacherId: 1,
    },
  ],
  "2021-09-02": [
    {
      id: 4,
      date: "2021-09-02T00:00:00.000Z",
      teacherId: 1,
    },
    {
      id: 5,
      date: "2021-09-02T00:00:00.000Z",
      teacherId: 1,
    },
  ],
};

export const Consultations = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" color="inherit" component="div">
        Personal projects
      </Typography>
      {Object.entries(consultationsByDate).map(([key, value]) => (
        <>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="panel1a-header"
            >
              <Typography>{key}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {value.map((consultation) => (
                  <Grid item>
                    <Button variant="outlined">
                      {`${format(
                        new Date(consultation.date),
                        "HH:mm"
                      )} - ${format(
                        addMinutes(new Date(consultation.date), 15),
                        "HH:mm"
                      )}`}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </>
      ))}
    </Box>
  );
};
