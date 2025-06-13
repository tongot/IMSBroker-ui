"use client";
import MasterTable from "@/app/components/table/MasterTable";
import { GET } from "@/app/utils/http/GET";
import ICoverStructureFieldRule from "@/app/utils/interfaces/cover-structure/cover-structure-field-rule";
import IHeadCell from "@/app/utils/interfaces/head-cell";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import AddFieldRuleForm from "./AddFieldRuleForm";
import ICoverStructureField from "@/app/utils/interfaces/cover-structure/cover-structure-field";
import AddCoverStructureFieldForm from "./AddCoverStructureFieldForm";

interface FieldRulesProps {
  field: ICoverStructureField;
  refetchField: () => void;
}
const FieldRules = ({ field, refetchField }: FieldRulesProps) => {
  const { data, refetch } = useQuery({
    queryKey: ["underwriters-ins-rules" + field.id], // Unique key for caching
    queryFn: () =>
      GET<ICoverStructureFieldRule[]>(
        `/coverStructure/field/rules/${field.id}`
      ), // Function to fetch data
  });
  let children = <div>No rules set</div>;

  if (data) {
    const headCells: IHeadCell[] = [
      {
        id: "fieldName",
        type: 'text',
        disablePadding: true,
        label: "Field Name",
      },
      {
        id: "operator",
        type: 'text',
        disablePadding: true,
        label: "Operator",
      },
      {
        id: "value",
        type: 'text',
        disablePadding: true,
        label: "Value",
      },
      {
        id: "adjustmentType",
        type: 'text',
        disablePadding: true,
        label: "Adjustment Type",
      },
      {
        id: "adjuster",
        type: 'text',
        disablePadding: true,
        label: "Adjuster",
      },
      {
        id: "options",
        type: 'text',
        disablePadding: true,
        label: "Options",
      },
    ];

    children = (
      <MasterTable
        canSelectMultiple={false}
        headCells={headCells}
        data={data.map((x) => {
          return {
            ...x,
            options: (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexGap: "2px",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  <AddFieldRuleForm
                    field={field}
                    refetchRule={refetch}
                    rule={x}/>
                </Box>
              </>
            ),
          };
        })}
        sortBy="insuranceMainType"
        tableHeading={field.name + " " + "rules"}
        addNewLink=""
      >
        <AddFieldRuleForm field={field} refetchRule={refetch} />
        <AddCoverStructureFieldForm
          refetchField={refetchField}
          editStructureField={field}
          coverStructureId={field.coverStructureId}
        />
      </MasterTable>
    );
  }
  return <Box sx={{ padding: 1 }}>{children}</Box>;
};

export default FieldRules;
