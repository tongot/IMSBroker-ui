"use client";
import React, { useEffect, useState } from "react";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import MainContainer from "../components/layout/MainContainer";
import SubmitQuotation from "./quotation-components/SubmitQuotation";
import IMSModal from "../components/custom-components/IMSModal";
import InsuranceSelectionModal from "./quotation-components/InsuranceSelectionModal";
import { useInsTypeStore } from "../stores/lookup-store";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { QuotationAddOnDto, QuotationViewDto } from "../api/ims-client";
import { useQuery } from "@tanstack/react-query";
import IQuotationList from "../utils/interfaces/quotation/quotation-list";
import { GET } from "../utils/http/GET";
import LoadingPage from "../components/custom-components/LoadingPage";
import { toast } from "react-toastify";
import QuotationList from "./quotation-components/QuotationList";

const QuotationPage = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [modalSelectInsOpen, setModalSelectInsOpen] = useState(false);
  const [quoteDescription, setQuoteDescription] = useState<string>("");
  const [category, setCategory] = useState<number>(0);
  const [selectedQuote, setSelectedQuote] = useState<QuotationViewDto | null>(
    null
  );
  const [addOns, setAddOns] = useState<QuotationAddOnDto[]>([]);
  const loadingTypes = useInsTypeStore((state) => state.loadingInsType);
  const insTypes = useInsTypeStore((state) => state.insuranceTypes);
  const getInsType = useInsTypeStore((state) => state.getInsTypes);
  //const [searchString, setSearchString] = React.useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["Quotations"], // Unique key for caching
    queryFn: () => GET<IQuotationList[]>(`/Quotation?searchString=${""}`), // Function to fetch data
  });

  useEffect(() => {
    if (error) {
      toast.error("Error fetching quotations: " + error.message);
      return;
    }
    getInsType();
  }, [getInsType, error]);

  const handleContinue = (category: number, description: string) => {
    setModalSelectInsOpen(false);
    setQuoteDescription(description);
    setCategory(category);
    setOpenDialog(true);
  };

  const close = () => {
    setAddOns([]);
    setOpenDialog(false);
    setSelectedQuote(null);
  };

  const icon = <RequestQuoteIcon sx={{ fontSize: 34 }} />;

  return (
    <MainContainer
      heading={"Quotations"}
      icon={icon}
      buttons={
        <Button
          startIcon={<AddIcon />}
          loading={loadingTypes}
          onClick={() => setModalSelectInsOpen(true)}
        >
          Create Quote
        </Button>
      }
    >
      <InsuranceSelectionModal
        insTypes={insTypes}
        open={modalSelectInsOpen}
        onClose={() => setModalSelectInsOpen(false)}
        onContinue={handleContinue}
      />

      <IMSModal
        openDialog={openDialog}
        maxWidth="xl"
        heading="New Quotation"
        onClose={close}
      >
        <SubmitQuotation
          setAddOns={setAddOns}
          addOns={addOns}
          selectedQuote={selectedQuote}
          setSelectedQuote={setSelectedQuote}
          quoteDescription={quoteDescription}
          category={category}
          insTypes={insTypes}
        />
      </IMSModal>

      {isLoading && <LoadingPage />}
      {data && (
        <Box>
          <QuotationList data={data} />
        </Box>
      )}
    </MainContainer>
  );
};

export default QuotationPage;
