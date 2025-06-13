import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  Divider,
  IconButton,
  Collapse,
  styled,
  Chip,
} from "@mui/material";
import { ExpandMore, ExpandLess, CheckCircle } from "@mui/icons-material";
import LookUpPersonButton from "@/app/components/shared/LookUpPersonButton";
import { usePeopleStore } from "@/app/stores/people-store";
import { QuotationViewDto } from "@/app/api/ims-client";
import { formatCurrency } from "@/app/utils/common-funcs";

interface ViewQuoteModalProps {
  onConfirmSelection: (personId: number) => void;
  quotes: QuotationViewDto[];
  onSelect: (quote: QuotationViewDto) => void;
  loading:boolean
}

const ModalContainer = styled(Paper)(({ theme }) => ({
  width: "80%",
  maxWidth: "900px",
  maxHeight: "80vh",
  overflow: "auto",
  padding: theme.spacing(4)
}));

const QuoteItem = styled(Paper)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    border: `2px solid ${selected ? theme.palette.primary.main : "#e0e0e0"}`,
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: selected
        ? theme.palette.primary.dark
        : theme.palette.action.hover,
      boxShadow: theme.shadows[2],
    },
  })
);

const PremiumText = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.dark,
  fontWeight: "bold",
}));

const AddOnItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  display: "flex",
  justifyContent: "space-between",
}));

const ViewQuoteModal: React.FC<ViewQuoteModalProps> = ({
  onConfirmSelection,
  quotes,
  onSelect,
  loading
}) => {
  const [expandedQuoteId, setExpandedQuoteId] = useState<number | null>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);

  const selectedPerson = usePeopleStore((state) => state.selectedPeople);

  const handleExpand = (quoteId: number) => {
    setExpandedQuoteId(expandedQuoteId === quoteId ? null : quoteId);
  };

  const handleSelect = (quoteId: number) => {
    setSelectedQuoteId(quoteId);
    const selectedQuote = quotes.find((q) => q.coverId === quoteId);
    if (selectedQuote) {
      onSelect(selectedQuote);
    }
  };

  return (
    <ModalContainer elevation={0} sx={{ width: "100%" }}>
      <List>
        {quotes.map((quote) => (
          <React.Fragment key={quote.coverId}>
            <QuoteItem
              elevation={0}
              selected={selectedQuoteId === quote.coverId}
              onClick={() => handleSelect(quote.coverId || 0)}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {quote.coverName}
                  </Typography>
                  <Chip label={"Base Premium: " + formatCurrency(quote.coverBasePremium)} color="primary"/>
                  {quote.calcNotes && (
                    <Box sx={{display:"flex", flexDirection:"column"}}> 
                    {quote.calcNotes.split(';').map( (note, index) =>
                    <Typography key={index} variant="caption" color="secondary">
                      {note}
                    </Typography>)
                    }
                    </Box>
                  )}
                </Box>

                <Box textAlign="right">
                  <PremiumText variant="h6">
                    {formatCurrency(quote.finalPremium)}
                  </PremiumText>
                  <Typography variant="caption" color="secondary">
                  {quote.addOns?.filter(x => x.isSupported).length}/{quote.addOns?.length} add-ons available
                  </Typography>
                </Box>

                <Box>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpand(quote?.coverId || 0);
                    }}
                    aria-label={
                      expandedQuoteId === quote.coverId ? "Collapse" : "Expand"
                    }
                  >
                    {expandedQuoteId === quote.coverId ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                  {selectedQuoteId === quote.coverId ? (
                    <CheckCircle color="primary" fontSize="large" />
                  ) : (
                    <CheckCircle fontSize="large" color="disabled" />
                  )}
                </Box>
              </Box>

              <Collapse in={expandedQuoteId === quote.coverId}>
                <Box mt={2}>
                  <Divider />
                  <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                    Add-Ons (Total: {formatCurrency(quote.addOnsTotal)})
                  </Typography>
                  <List dense>
                    {quote.addOns?.map((addOn, index) => (
                      <AddOnItem key={index}>
                        <Box>
                          <Typography>{addOn.name}</Typography>
                          <Typography variant="body2" color="secondary">
                            Rate: {addOn.rate}%
                          </Typography>
                          <Typography
                            variant="body2"
                            color={addOn.isSupported ? "primary" : "error"}
                          >
                            Note: {addOn.note}
                          </Typography>
                        </Box>
                        <Typography>{formatCurrency(addOn.amount)}</Typography>
                      </AddOnItem>
                    ))}
                  </List>
                </Box>
              </Collapse>
            </QuoteItem>
          </React.Fragment>
        ))}
      </List>
      <Box>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          {selectedPerson.length > 0
            ? `Selected Person: ${selectedPerson.map((p) => p.firstName + " " + p.lastName).join(", ")}`
            : "No person selected"}
          {selectedPerson.length > 1 &&
            "(Multiple people selection is not allowed)"}
        </Typography>
      </Box>
      <LookUpPersonButton />
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          loading={loading}
          onClick={() => onConfirmSelection(selectedPerson[0]?.id || 0)}
          disabled={
            !selectedQuoteId ||
            selectedPerson.length === 0 ||
            selectedPerson.length > 1
          }
        >
          Confirm Selection
        </Button>
      </Box>
    </ModalContainer>
  );
};

export default ViewQuoteModal;
