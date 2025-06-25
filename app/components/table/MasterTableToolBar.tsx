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
  addBtn?: React.ReactNode;
}

export default function MasterTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    canSelectMultiple,
    children,
    tableHeading,
    addNewUrl,
    addBtn,
  } = props;

  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          background: (theme) =>
            numSelected > 0 && canSelectMultiple
              ? alpha(theme.palette.primary.main, 0.1)
              : "linear-gradient(45deg, #f5f5f5, #e0e0e0)",
          borderRadius: 1,
          mb: 2,
        }}
      >
        {canSelectMultiple ? (
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
            {numSelected > 0 && (
              <Tooltip title="Delete">
                <IconButton>
                  <DeleteIcon sx={{ color: "error.main" }} />
                </IconButton>
              </Tooltip>
            )}
          </>
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
        {(addBtn || addNewUrl) && (
            <>
              {addBtn ? (
                addBtn
              ) : (
                <Tooltip title="Add New">
                  <Link href={addNewUrl}>
                    <IconButton>
                      <AddIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                  </Link>
                </Tooltip>
              )}
            </>
          )}
      </Toolbar>
      {children && (
        <Toolbar sx={{ justifyContent: "end", mb: 2 }}>{children}</Toolbar>
      )}
    </>
  );
}
