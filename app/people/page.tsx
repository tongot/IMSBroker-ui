"use client";
import React from "react";
import MainContainer from "../components/layout/MainContainer";
import { useQuery } from "@tanstack/react-query";
import MasterTable from "../components/table/MasterTable";
import PersonInputButton from "../components/shared-button-components/PersonInputButton";
import PeopleIcon from '@mui/icons-material/People';
import { Box, IconButton, Tooltip } from "@mui/material";
import { GET } from "../utils/http/GET";
import IPeople from "../utils/interfaces/person/view-people";
import IHeadCell from "../utils/interfaces/head-cell";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

const PeoplePage = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ["People"], // Unique key for caching
    queryFn: () => GET<IPeople[]>("/people"), // Function to fetch data
  });
  let children = <div>No People</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (data) {
    const headCells: IHeadCell[] = [
      {
        id: "firstName",
        type: "text",
        disablePadding: true,
        label: "First Name",
        alignment: "left",
      },
      {
        id: "lastName",
        type: "text",
        disablePadding: true,
        label: "Last Name",
      },
      {
        id: "middleName",
        type: "text",
        disablePadding: true,
        label: "Middle Name",
      },
      {
        id: "dateOfBirth",
        type: "date",
        disablePadding: true,
        label: "DOB",

      },
      {
        id: "identityNumber",
        type: "text",
        disablePadding: true,
        label: "Identity Number",

      },
      {
        id: "gender",
        type: "text",
        disablePadding: true,
        label: "Gender",
      },
      {
        id: "nationality",
        type: "text",
        disablePadding: true,
        label: "Nationality",
      },
      {
        id: "maritalStatus",
        type: "text",
        disablePadding: true,
        label: "Marital Status",
      },
      {
        id: "occupation",
        type: "text",
        disablePadding: true,
        label: "Occupation",
      },
      {
        id: "identityType",
        type: "text",
        disablePadding: true,
        label: "Identity  Type",
      },
      {
        id: "race",
        type: "text",
        disablePadding: true,
        label: "Race",
      },
      {
        id: "options",
        type: "component",
        disablePadding: true,
        label: "Options",
        alignment:"center"
      }
    ];

    children = (
      <MasterTable
        canSelectMultiple={false}
        headCells={headCells}
        sortBy="name"
        tableHeading="List of People"
        addNewLink=""
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
                      <PersonInputButton personData={x}/>
                  </Tooltip>
                  <Tooltip title="Request Quote">
                    <IconButton>
                    <RequestQuoteIcon/>
                  </IconButton>
                  </Tooltip>
                </Box>
              </>
            ),
          };
        })}
      addBtn={<PersonInputButton/>}
      />
    );
  }
  const icon = <PeopleIcon sx={{ fontSize: 34 }} />;
  return (
    <MainContainer heading={"People"} icon={icon}>
      {children}
    </MainContainer>
  );
};

export default PeoplePage
  ;
