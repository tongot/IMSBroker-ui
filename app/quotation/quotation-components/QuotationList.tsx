"use client";
import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import IHeadCell from "@/app/utils/interfaces/head-cell";
import MasterTable from "@/app/components/table/MasterTable";
import IQuotationList from "@/app/utils/interfaces/quotation/quotation-list";
import { useRouter } from "next/navigation";

interface IQuotationListProps {
  data: IQuotationList[];
}

const QuotationList = ({ data }: IQuotationListProps) => {

  const router = useRouter();

  const navigateToQuotation = (id: number) => {
    router.push(`/quotation/${id}`);
  };

  const headCells: IHeadCell[] = [
    {
      id: "coverName",
      type: "text",
      disablePadding: true,
      label: "Cover Name",
      alignment: "left",
    },
    {
      id: "underwriterName",
      type: "text",
      disablePadding: true,
      label: "Underwriter Name",
    },
    {
      id: "finalPremium",
      type: "currency",
      disablePadding: true,
      label: "Final Premium",
    },
    {
      id: "qouteNumber",
      type: "text",
      disablePadding: true,
      label: "Quote Number",
    },
    {
      id: "amountInsured",
      type: "currency",
      disablePadding: true,
      label: "Amount Insured",
    },
    {
      id: "excess",
      type: "currency",
      disablePadding: true,
      label: "Excess",
    },
    {
      id: "personName",
      type: "text",
      disablePadding: true,
      label: "Person",
    },
    {
        id: "createdBy",
        type: "text",
        disablePadding: true,
        label: "Initiated By",
      },
    {
      id: "maybeModifiedOn",
      type: "date",
      disablePadding: true,
      label: "Date Modified",
    }
  ];

  return (
    <MasterTable
      canSelectMultiple={false}
      headCells={headCells}
      sortBy="name"
      tableHeading="Quotation List"
      addNewLink=""
      editFn={navigateToQuotation}
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
                <Tooltip title="Edit user">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => navigateToQuotation(x.id || 0)}
                    sx={{ color: "primary.main" }}
                  />
                </Tooltip>
              </Box>
            </>
          ),
        };
      })}
    />
  );
};

export default QuotationList;
