import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { addMinutes, format } from "date-fns";
import { ConsultationModal } from "../ConsultationModal/ConsultationModal";
import { useEffect, useState, Fragment, useContext, useMemo } from "react";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";
import { Context } from "../../contexts/UserContext";
import {
  getConsultationsForStudent,
  getConsultationsForTeacher,
  postConsultations,
  putConsultation,
} from "../../api/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { orderBy } from "lodash";

export const Consultations = () => {
  const context = useContext(Context);
  const router = useRouter();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [consultations, setConsultations] = useState<any>(null);

  const groupedConsultations: Record<string, any[]> | null = useMemo(() => {
    if (!consultations) return null;
    const groups = {};

    consultations.forEach((consultation) => {
      const date = format(new Date(consultation.date), "yyyy-MM-dd");
      if (!groups[date]) groups[date] = [];
      groups[date].push(consultation);
    });

    return groups;
  }, [consultations]);

  const handleConsultationReserve = async () => {
    if (!selectedConsultation || !context?.user?.personalProjects.length)
      return;

    console.log("Reserve consultation", selectedConsultation);
    try {
      const consultation = await putConsultation(selectedConsultation.id, {
        personalProjectId: context?.user?.personalProjects[0].id,
        studentId: context?.user?.id,
      });
      setConsultations((consultations) =>
        consultations.filter((c) => c.id !== consultation.id)
      );
      toast.success("Consultation successfully reserved");
      setIsConfirmationModalOpen(false);
      setSelectedConsultation(null);
    } catch (e) {
      toast.error(
        (e as AxiosError<{ statusCode: number; message: string }>).response
          ?.data?.message
      );
    }
  };

  const handleConsultationCreate = async (
    consultation: { date: Date },
    onSuccess: () => void
  ) => {
    if (!context || !context.user) return;

    try {
      await postConsultations({
        ...consultation,
        teacherId: context.user.id,
      }).then((response) => {
        setConsultations((currentConsultations) =>
          orderBy([...currentConsultations, response], ["date", "asc"])
        );
        onSuccess();
      });
    } catch (e) {
      toast.error(
        (e as AxiosError<{ statusCode: number; message: string }>).response
          ?.data?.message
      );
    }
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

  useEffect(() => {
    if (!context || !context.user || consultations) return;

    (context.isStudent
      ? getConsultationsForStudent(context.user.id)
      : getConsultationsForTeacher(context.user.id)
    )
      .then((res) => setConsultations(res))
      .catch((e) =>
        toast.error(
          (e as AxiosError<{ statusCode: number; message: string }>).response
            ?.data?.message
        )
      );
  });

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
                "yyyy.MM.dd"
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
            Consultations
          </Typography>
          <Divider />
          <ConsultationModal onConsultationCreate={handleConsultationCreate} />
        </Box>
        {context?.isTeacher ||
        (context?.isStudent && context?.hasApprovedPersonalProject) ? (
          <>
            {!!consultations?.length && groupedConsultations ? (
              Object.entries(groupedConsultations).map(([key, value]) => (
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
                              onClick={() =>
                                setSelectedConsultation(consultation)
                              }
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
              ))
            ) : (
              <Typography>No consultations available</Typography>
            )}
          </>
        ) : (
          <Typography variant="h6" color="inherit" component="div">
            You have not approved your personal project yet.
          </Typography>
        )}
      </Box>
    </>
  );
};
