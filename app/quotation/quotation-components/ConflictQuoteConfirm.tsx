import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CardActions,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CreateQuotationRespDto } from "@/app/api/ims-client";
import { usePeopleStore } from "@/app/stores/people-store";

type Props = {
  data: CreateQuotationRespDto;
  onIgnoreConflict: (personId: number)=>void;
  loading:boolean;
}

const ConflictQuoteConfirm: React.FC<Props> = ({ data, onIgnoreConflict, loading }) => {

  const selectedPerson = usePeopleStore((state) => state.selectedPeople);
  
  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: 4,
      }}
    >
      <CardHeader
        title="Quotation Summary"
        slotProps={{
          title: {
            typography: {
              variant: "h5",
              fontWeight: 600,
            },
          },
        }}
      />
      <CardContent>
        <Grid container spacing={2}>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Conflicting Quote ID
            </Typography>
            <Typography variant="body1">
              {data.conflictingQuoteId}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Conflicting Quote Number
            </Typography>
            <Typography variant="body1">
              {data.conflictingQuoteNumber ?? "N/A"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Created By
            </Typography>
            <Typography variant="body1">
              {data.conflictingCreatedBy ?? "N/A"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Targeted Customer
            </Typography>
            <Typography variant="body1">
              {(selectedPerson[0]?.firstName ||""+ " "+ selectedPerson[0]?.lastName||"") ?? "N/A"}
            </Typography>
          </Grid>
        </Grid>
        

        {data.matchingFieldDtos && data.matchingFieldDtos?.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell><strong>Field Name</strong></TableCell>
                  <TableCell><strong>Value</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.matchingFieldDtos.map((field, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{field.name ?? "—"}</TableCell>
                    <TableCell>{field.value ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
      <CardActions>
          <Button onClick={() =>onIgnoreConflict(selectedPerson[0]?.id || 0)} variant="contained" color="error" loading={loading}>Proceed anyway</Button>
      </CardActions>
    </Card>
  );
};

export default ConflictQuoteConfirm;
