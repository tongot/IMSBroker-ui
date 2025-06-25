"use client";
import MainContainer from "@/app/components/layout/MainContainer";
import EditIcon from "@mui/icons-material/Edit";
import React, { use } from "react";
import EditQuotation from "../quotation-components/EditQuotation";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/app/utils/http/GET";
import { IGetQuotationDto } from "@/app/api/ims-client";
import LoadingPage from "@/app/components/custom-components/LoadingPage";
import { useRouter } from "next/navigation";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditQuotePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolveParams = use(params);

  const router = useRouter();

  const backToList = () => {
    router.push("/quotation");
  };

  //get quotation by id
  const { data, isLoading, error, isPending } = useQuery({
    queryKey: ["quotation-" + resolveParams.id], // Unique key for caching
    queryFn: () =>
      GET<IGetQuotationDto>("/Quotation/get-quotation/" + +resolveParams.id), // Function to fetch data
  });

  const icon = <EditIcon sx={{ fontSize: 34 }} />;
  return (
    <MainContainer
      heading={"Edit Quotation"}
      icon={icon}
      buttons={
        <IconButton onClick={backToList}>
          <ArrowBackIcon />
        </IconButton>
      }
    >
      {isLoading && <LoadingPage />}
      {!isPending && !data && !error && (
        <div>No Quotation with id {resolveParams.id}</div>
      )}
      {data && <EditQuotation quotation={data} loading={isPending} />}
    </MainContainer>
  );
};
export default EditQuotePage;
