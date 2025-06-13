import React, { useState } from 'react';
import {
  Button,
  Collapse,
  Typography,
  Card,
  ListItem,
  ListItemText,
  List,
  CardContent,
  Box,
  IconButton,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import { ICoverState } from "@/app/utils/interfaces/state-machine/cover-state";
import AddCoverStateForm from "./AddCoverStateForm";
import DeleteIcon from "@mui/icons-material/Delete";
import { IAddCoverState } from "@/app/utils/interfaces/state-machine/add-cover-state";

interface Props {
  states: ICoverState[];
  onSubmit: (data: IAddCoverState) => void;
  onDelete: (stateId: number) => void;
  currentCoverId: number;
  loading: boolean;
}

const StateMachineView = ({
  states,
  onDelete,
  onSubmit,
  currentCoverId,
  loading,
}: Props) => {
  const [expandedStates, setExpandedStates] = useState<{ [key: number]: boolean }>({});

  const handleExpand = (order: number) => {
    setExpandedStates((prev) => ({
      ...prev,
      [order]: !prev[order],
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      {states.map((state) => (
        <Card
          key={state.order}
          elevation={4}
          sx={{
            mb: 3,
            borderRadius: 2,
            p: 2,
            backgroundColor: '#f9f9f9',
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {state.name}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <AddCoverStateForm
                  coverId={currentCoverId}
                  onSubmit={onSubmit}
                  coverState={state}
                  loading={loading}
                />
                <IconButton color="error" onClick={() => onDelete(state.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Order:</strong> {state.order}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Cover ID:</strong> {state.coverStructureId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Is Active:</strong>{" "}
                  <Chip
                    label={state.isActive ? "Yes" : "No"}
                    color={state.isActive ? "success" : "default"}
                    size="small"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Current Users:</strong> {state.users?.length}
                </Typography>
              </Grid>
            </Grid>

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => handleExpand(state.order)}
              sx={{
                textTransform: "none",
                mb: expandedStates[state.order] ? 2 : 0,
              }}
            >
              {expandedStates[state.order] ? "Hide Users" : "Show Users"}
            </Button>

            <Collapse in={expandedStates[state.order]} timeout="auto" unmountOnExit>
              <Divider sx={{ mb: 1 }} />
              {state.users.length > 0 ? (
                <List dense>
                  {state.users.map((user) => (
                    <ListItem key={user.id} disablePadding>
                      <ListItemText
                        primary={`User ID: ${user.id}`}
                        secondary={`Name: ${user.userName}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No users assigned to this state.
                </Typography>
              )}
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StateMachineView;
