"use client";
import React from "react";
import MainContainer from "../components/MainContainer";
import { useQuery } from "@tanstack/react-query";
import MasterTable from "../components/table/MasterTable";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { useRouter } from "next/navigation";
import { GET } from "../utils/http/GET";
import IUnderwriterList from "../utils/interfaces/underwriters/underwriter-list";
import IHeadCell from "../utils/interfaces/head-cell";

const UnderwriterPage = () => {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["underwriters"], // Unique key for caching
    queryFn: () => GET<IUnderwriterList[]>("/underwriter"), // Function to fetch data
  });
  let children = <div>No Underwriters</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (data) {
    const headCells: IHeadCell[] = [
      {
        id: "name",
        type: "text",
        disablePadding: true,
        label: "Name",
      },
      {
        id: "status",
        type: "text",
        disablePadding: true,
        label: "Status",
      }
    ];

    children = (
      <MasterTable
        canSelectMultiple={false}
        headCells={headCells}
        data={data}
        sortBy="name"
        tableHeading="List of Underwriters"
        addNewLink="/underwriters/new"
        editFn={(id: number) => {router.push("/underwriters/"+id)}}
      />
    );
  }
  const icon = <CorporateFareIcon sx={{ fontSize: 34 }} />;
  return (
    <MainContainer heading={"Underwriters"} icon={icon}>
      {children}
    </MainContainer>
  );
};

export default UnderwriterPage
  ;
