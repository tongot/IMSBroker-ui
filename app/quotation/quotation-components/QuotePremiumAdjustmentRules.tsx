"use client"
import { Accordion, AccordionDetails, AccordionSummary, Paper, Typography } from '@mui/material';
import React, { useState } from 'react'
import RuleDisplay from './RuleDisplay';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {IGetQuotationDto } from '@/app/api/ims-client';

interface QuotePremiumAdjustmentRulesProps
{
    quotation: IGetQuotationDto, 
    loading:boolean
}

const QuotePremiumAdjustmentRules = ({quotation, loading}:QuotePremiumAdjustmentRulesProps) => {
      const [expandedField, setExpandedField] = useState<string | false>(false);

        const handleAccordionChange =
          (field: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpandedField(isExpanded ? field : false);
          };
      
  return (
    <Paper
             elevation={0}
           >
             <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
               Premium adjustment rules for this cover
             </Typography>
   
             {quotation.fieldsView?.categorisedFields?.map((field) => {
               return (
                 <Accordion
                   key={field.name}
                   expanded={expandedField === field.name}
                   onChange={handleAccordionChange(field.name || "")}
                   sx={{ mb: 1 }}
                 >
                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                     <Typography fontWeight={500}>{field.name}</Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                     {field.fields?.map((f) =>
                       f.premiumCalcRule?.length === 0 ? (
                         <></>
                       ) : (
                         f.premiumCalcRule?.map((rule) => (
                           <RuleDisplay
                             key={rule.id}
                             loading={loading}
                             quotationFieldId={f.quotationFieldId || 0}
                             quotationId={quotation.id || 0}
                             rule={rule}
                             onToggleActive={() => {}}
                           />
                         ))
                       )
                     )}
                   </AccordionDetails>
                 </Accordion>
               );
             })}
           </Paper>
  )
}

export default QuotePremiumAdjustmentRules
