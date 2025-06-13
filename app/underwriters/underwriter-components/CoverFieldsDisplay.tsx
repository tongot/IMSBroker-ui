import CustomAccordion from "@/app/components/CustomAccordion";
import React from "react";
import FieldRules from "./FieldRules";
import { TextField, Typography, Box, Fade } from "@mui/material";
import ICoverStructureField from "@/app/utils/interfaces/cover-structure/cover-structure-field";

interface CoverFieldsDisplayProps {
  isFetching: boolean;
  fieldData: ICoverStructureField[];
  fieldSearchString: string;
  onFilter: (filterValue: string) => void;
  refetch: () => void;
}

const CoverFieldsDisplay = ({
  fieldData,
  fieldSearchString,
  onFilter,
  refetch,
  isFetching,
}: CoverFieldsDisplayProps) => {
  const filteredFields = fieldData?.filter((x) =>
    x.name.toLowerCase().includes(fieldSearchString.toLowerCase())
  );

  return (
    <Box>
      <TextField
        label="Search Field Name"
        fullWidth
        variant="outlined"
        value={fieldSearchString}
        onChange={(e) => onFilter(e.target.value)}
        sx={{ my: 2 }}
      />

      {filteredFields?.length > 0 ? (
        <Fade in>
          <Box>
            {filteredFields.map((item) => (
              <CustomAccordion
                key={item.id}
                panelId={item.id}
                heading={`${item.name} (${item.type})`}
              >
                <FieldRules field={item} refetchField={refetch} />
              </CustomAccordion>
            ))}
          </Box>
        </Fade>
      ) : !isFetching ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {fieldData.length > 0
            ? "No matching fields found."
            : "No fields for this cover. Press +Field to add."}
        </Typography>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default CoverFieldsDisplay;
