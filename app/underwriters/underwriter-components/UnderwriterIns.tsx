"use client";
import MasterTable from "@/app/components/table/MasterTable";
import { GET } from "@/app/utils/http/GET";
import IHeadCell from "@/app/utils/interfaces/head-cell";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import IUnderwriterIns from "@/app/utils/interfaces/underwriters/underwriter-ins";
import IHttpResponse from "@/app/utils/http/http-response";
import UnderwriterInsForm from "./UnderwriterInsForm";
import { Box, Button } from "@mui/material";
import Link from "next/link";

interface UnderwriterProps {
  underwriterId: number;
}
const UnderwriterIns = ({ underwriterId }: UnderwriterProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["underwriters-ins"], // Unique key for caching
    queryFn: () =>
      GET<IHttpResponse<IUnderwriterIns[]>>(
        `/underwriter/Underwriter-ins/${underwriterId}`
      ), // Function to fetch data
  });
  let children = <div>No insurance type</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (data) {
    const headCells: IHeadCell[] = [
      {
        id: "insuranceMainType",
        type: "text",
        disablePadding: true,
        label: "Insurance Main Type",
      },
      {
        id: "totalCommission",
        type: "number",
        disablePadding: true,
        label: "Total Commission",
      },
      {
        id: "commission",
        type: "number",
        disablePadding: true,
        label: "Commission",
      },
      {
        id: "vat",
        type: "number",
        disablePadding: true,
        label: "VAT",
      },
      {
        id: "options",
        type: "component",
        disablePadding: true,
        label: "Options",
      },
    ];

    children = (
      <MasterTable
        canSelectMultiple={false}
        headCells={headCells}
        data={data.data.map((x) => {
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
                  <UnderwriterInsForm
                    underwriterId={underwriterId}
                    editInsType={x}
                  />
                  <Link
                    href={`/underwriters/${underwriterId}/config-cover/${x.id}`}
                  >
                    <Button variant="outlined" size="small">
                      add cover
                    </Button>
                  </Link>
                </Box>
              </>
            ),
          };
        })}
        sortBy="insuranceMainType"
        tableHeading="Types"
        addNewLink=""
      >
        <UnderwriterInsForm underwriterId={underwriterId} />
      </MasterTable>
    );
  }
  //const icon = <MonetizationOnIcon sx={{ fontSize: 34 }} />;
  return children;
};

export default UnderwriterIns;
