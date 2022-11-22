import {
  Box,
  Button,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export const PersonalProjectDetails = () => {
  const [project, setProject] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState<any>([
    {
      label: "Select campaign settings",
      description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
    },
    {
      label: "Create an ad group",
      description:
        "An ad group contains one or more ads which target a shared set of keywords.",
    },
    {
      label: "Create an ad",
      description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
    },
  ]);

  const handleNext = () => {
    activeStep === steps.length - 1 && setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    activeStep > 0 && setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    console.log("fetching project");
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h5"
        color="inherit"
        component="div"
        onClick={() =>
          setSteps((current) => [
            ...current,
            { label: "test", description: "asdkekw" },
          ])
        }
      >
        title
      </Typography>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label} onClick={() => setActiveStep(index)}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
