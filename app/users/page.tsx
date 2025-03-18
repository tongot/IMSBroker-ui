"use client";
import React from "react";
import MainContainer from "../components/MainContainer";
import AccountCircleRound from "@mui/icons-material/AccountCircleRounded";
import { useQuery } from "@tanstack/react-query";
import MasterTable from "../components/table/MasterTable";
import IUser from "../utils/interfaces/users/user";
import { GET } from "../utils/http/GET";
import IHeadCell from "../utils/interfaces/head-cell";

const UsersPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"], // Unique key for caching
    queryFn: () => GET<IUser[]>("/User"), // Function to fetch data
  });
  let children = <div>No users</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (data) {
    const headCells: IHeadCell[] = [
      {
        id: "userName",
        type: "text",
        disablePadding: true,
        label: "Username",
      },
      {
        id: "email",
        type: "text",
        disablePadding: false,
        label: "Email",
      },
    ];

    children = (
      <MasterTable
        canSelectMultiple={true}
        headCells={headCells}
        data={data}
        sortBy="userName"
        tableHeading="List of Users"
        addNewLink="/users/new"
      />
    );
  }
  const icon = <AccountCircleRound sx={{ fontSize: 34 }} />;
  return (
    <MainContainer heading={"Users"} icon={icon}>
      {children}
    </MainContainer>
  );
};

export default UsersPage;
