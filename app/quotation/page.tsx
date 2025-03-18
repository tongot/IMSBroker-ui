"use client";
import React from "react";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import MainContainer from "../components/MainContainer";
import SubmitQuotation from "./quotation-components/SubmitQuotation";



const QuotationPage = () => {
const icon = <RequestQuoteIcon sx={{ fontSize: 34 }} />;
  
  return (
    <MainContainer heading={"Quotations"} icon={icon}>
        <SubmitQuotation/>
    </MainContainer>
  );
};

export default QuotationPage;
