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
import { ConsultationModal } from "../ConsultationModal/ConsultationModal";
import { useEffect, useState, Fragment } from "react";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";

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
      date: "2021-09-02T14:00:00.000Z",
      teacherId: 1,
    },
    {
      id: 5,
      date: "2021-09-02T18:00:00.000Z",
      teacherId: 1,
    },
  ],
};

export const Consultations = () => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  const handleConsultationReserve = () => {
    setIsConfirmationModalOpen(false);
    console.log("Reserve consultation", selectedConsultation);
    setSelectedConsultation(null);
  };

  const handleCancel = () => {
    setIsConfirmationModalOpen(false);
    setSelectedConsultation(null);
  };

  useEffect(() => {
    if (selectedConsultation) {
      setIsConfirmationModalOpen(true);
    }
  }, [selectedConsultation]);

  return (
    <>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onCancel={handleCancel}
        onConfirm={handleConsultationReserve}
        description={
          selectedConsultation
            ? `Are you sure you want to reserve the following consultation: ${format(
                new Date(selectedConsultation.date),
                "yyyy.LLLL.dd"
              )} ${format(
                new Date(selectedConsultation.date),
                "HH:mm"
              )} - ${format(
                addMinutes(new Date(selectedConsultation.date), 15),
                "HH:mm"
              )}`
            : ""
        }
      />
      <Box sx={{ p: 2 }}>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" color="inherit" component="div">
            Personal projects
          </Typography>
          <ConsultationModal />
        </Box>
        {Object.entries(consultationsByDate).map(([key, value]) => (
          <Fragment key={key}>
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
                    <Grid item key={consultation.id}>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedConsultation(consultation)}
                      >
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
          </Fragment>
        ))}
      </Box>
    </>
  );
};
