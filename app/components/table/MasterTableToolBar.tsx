import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

interface EnhancedTableToolbarProps {
  numSelected: number;
  canSelectMultiple: boolean;
  children?: React.ReactNode;
  tableHeading: string;
  addNewUrl: string;
}
export default function MasterTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, canSelectMultiple, children, tableHeading, addNewUrl } =
    props;
  return (
    <>
      <Toolbar
        sx={[
          {
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          },
          numSelected > 0 &&
            canSelectMultiple && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            },
        ]}
      >
        {canSelectMultiple && (
          <>
            {numSelected > 0 ? (
              <Typography
                sx={{ flex: "1 1 100%" }}
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {numSelected} selected
              </Typography>
            ) : (
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                {tableHeading}
              </Typography>
            )}
            {numSelected > 0 ? (
              <Tooltip title="Delete">
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Add New">
                <Link href={addNewUrl}>
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                </Link>
              </Tooltip>
            )}
          </>
        )}
      </Toolbar>
      {children && (
        <Toolbar
          sx={{
            justifyContent: "end",
          }}
        >
          {children}
        </Toolbar>
      )}
    </>
  );
}
